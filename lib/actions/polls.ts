"use server"

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreatePollRequest } from '@/types'

// Create a new poll
export async function createPoll(data: CreatePollRequest) {
  try {
    const supabase = createServerClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('You must be logged in to create a poll')
    }

    // First, create the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: data.title,
        description: data.description || null,
        created_by: user.id,
        allow_multiple_votes: data.allowMultipleVotes,
        expires_at: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
        is_active: true
      })
      .select()
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      throw new Error('Failed to create poll')
    }

    // Then, create the poll options
    const pollOptions = data.options
      .filter(option => option.trim() !== '')
      .map(option => ({
        poll_id: poll.id,
        text: option.trim()
      }))

    if (pollOptions.length < 2) {
      throw new Error('A poll must have at least 2 options')
    }

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions)

    if (optionsError) {
      console.error('Error creating poll options:', optionsError)
      // If options fail, we should delete the poll to maintain consistency
      await supabase.from('polls').delete().eq('id', poll.id)
      throw new Error('Failed to create poll options')
    }

    revalidatePath('/polls')
    revalidatePath('/dashboard')
    
    return { success: true, pollId: poll.id }
  } catch (error) {
    console.error('Error in createPoll:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create poll' 
    }
  }
}

// Fetch all active polls
export async function getActivePolls() {
  try {
    const supabase = createServerClient()
    
    const { data: polls, error } = await supabase
      .from('active_polls')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active polls:', error)
      throw new Error('Failed to fetch polls')
    }

    return { success: true, polls: polls || [] }
  } catch (error) {
    console.error('Error in getActivePolls:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch polls',
      polls: []
    }
  }
}

// Fetch a specific poll with options
export async function getPollWithOptions(pollId: string) {
  try {
    const supabase = createServerClient()
    
    // Get the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select(`
        *,
        users!polls_created_by_fkey(name, email)
      `)
      .eq('id', pollId)
      .single()

    if (pollError) {
      console.error('Error fetching poll:', pollError)
      throw new Error('Poll not found')
    }

    // Get the poll options
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', pollId)
      .order('created_at', { ascending: true })

    if (optionsError) {
      console.error('Error fetching poll options:', optionsError)
      throw new Error('Failed to fetch poll options')
    }

    // Get vote counts for each option
    const { data: voteCounts, error: voteError } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)

    if (voteError) {
      console.error('Error fetching vote counts:', voteError)
      // Don't fail the entire request for this
    }

    // Combine options with vote counts
    const optionsWithVotes = options.map(option => {
      const voteCount = voteCounts?.find(vc => vc.option_id === option.id)
      return {
        ...option,
        vote_count: voteCount?.vote_count || 0
      }
    })

    return { 
      success: true, 
      poll: { ...poll, options: optionsWithVotes } 
    }
  } catch (error) {
    console.error('Error in getPollWithOptions:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch poll' 
    }
  }
}

// Submit a vote
export async function submitVote(pollId: string, optionId: string) {
  try {
    const supabase = createServerClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('You must be logged in to vote')
    }

    // Check if the poll is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('is_active, expires_at, allow_multiple_votes')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (!poll.is_active) {
      throw new Error('This poll is no longer active')
    }

    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      throw new Error('This poll has expired')
    }

    // Check if user has already voted on this option (unless multiple votes allowed)
    if (!poll.allow_multiple_votes) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', user.id)
        .eq('option_id', optionId)
        .single()

      if (existingVote) {
        throw new Error('You have already voted on this option')
      }
    }

    // Submit the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        user_id: user.id,
        option_id: optionId
      })

    if (voteError) {
      console.error('Error submitting vote:', voteError)
      throw new Error('Failed to submit vote')
    }

    revalidatePath(`/polls/${pollId}`)
    revalidatePath('/polls')
    
    return { success: true }
  } catch (error) {
    console.error('Error in submitVote:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit vote' 
    }
  }
}

// Delete a poll (only by creator)
export async function deletePoll(pollId: string) {
  try {
    const supabase = createServerClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('You must be logged in to delete a poll')
    }

    // Check if the user is the creator of the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) {
      throw new Error('Poll not found')
    }

    if (poll.created_by !== user.id) {
      throw new Error('You can only delete polls you created')
    }

    // Delete the poll (cascade will handle options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (deleteError) {
      console.error('Error deleting poll:', deleteError)
      throw new Error('Failed to delete poll')
    }

    revalidatePath('/polls')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error in deletePoll:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete poll' 
    }
  }
}

// Get user's polls for dashboard
export async function getUserPolls() {
  try {
    const supabase = createServerClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('You must be logged in to view your polls')
    }

    // Get all polls created by the user
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options(id),
        votes(id)
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (pollsError) {
      console.error('Error fetching user polls:', pollsError)
      throw new Error('Failed to fetch your polls')
    }

    // Calculate stats
    const totalPolls = polls?.length || 0
    const activePolls = polls?.filter(poll => poll.is_active).length || 0
    const totalVotes = polls?.reduce((sum, poll) => sum + (poll.votes?.length || 0), 0) || 0

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentVotes = polls?.reduce((sum, poll) => {
      const recentVotesForPoll = poll.votes?.filter((vote: any) => 
        new Date(vote.created_at) > sevenDaysAgo
      ).length || 0
      return sum + recentVotesForPoll
    }, 0) || 0

    return { 
      success: true, 
      polls: polls || [],
      stats: {
        totalPolls,
        activePolls,
        totalVotes,
        thisMonth: recentVotes
      }
    }
  } catch (error) {
    console.error('Error in getUserPolls:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch user polls',
      polls: [],
      stats: {
        totalPolls: 0,
        activePolls: 0,
        totalVotes: 0,
        thisMonth: 0
      }
    }
  }
}

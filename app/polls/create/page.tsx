"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreatePollForm } from "@/components/polls/create-poll-form"
import { createPoll } from "@/lib/actions/polls"
import { CreatePollRequest } from "@/types"
import { toast } from "sonner"

export default function CreatePollPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePoll = async (data: CreatePollRequest) => {
    setIsLoading(true)
    
    try {
      const result = await createPoll(data)
      
      if (result.success) {
        toast.success("Poll created successfully!")
        router.push(`/polls/${result.pollId}`)
      } else {
        toast.error(result.error || "Failed to create poll")
      }
    } catch (error) {
      console.error("Error creating poll:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
          <p className="text-lg text-gray-600">
            Ask a question and let others vote on the options
          </p>
        </div>
        
        <CreatePollForm onSubmit={handleCreatePoll} isLoading={isLoading} />
      </div>
    </div>
  )
}

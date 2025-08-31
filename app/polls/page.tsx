import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getActivePolls } from "@/lib/actions/polls"

export default async function PollsPage() {
  const { polls, error } = await getActivePolls()
  
  // Type assertion to ensure polls is properly typed
  const typedPolls = polls as any[]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover and vote on polls created by the community
            </p>
          </div>
          <Button asChild>
            <Link href="/polls/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Poll
            </Link>
          </Button>
        </div>

        {error && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error loading polls</h3>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        )}

        {!error && polls.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a poll!</p>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

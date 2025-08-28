import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock data - TODO: Replace with real API call
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for development",
    options: [
      { id: "1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "Java", votes: 22 },
      { id: "4", text: "C++", votes: 15 },
    ],
    createdBy: "user123",
    isActive: true,
    allowMultipleVotes: false,
    expiresAt: new Date("2024-12-31"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Best framework for web development?",
    description: "Which framework do you think is the most efficient?",
    options: [
      { id: "5", text: "React", votes: 52 },
      { id: "6", text: "Vue.js", votes: 28 },
      { id: "7", text: "Angular", votes: 19 },
      { id: "8", text: "Svelte", votes: 12 },
    ],
    createdBy: "user456",
    isActive: true,
    allowMultipleVotes: true,
    expiresAt: new Date("2024-11-30"),
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export default function PollsPage() {
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

        {mockPolls.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a poll!</p>
            <Button asChild>
              <Link href="/polls/create">Create Your First Poll</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

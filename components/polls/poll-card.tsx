"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PollCardProps {
  poll: Poll
  onVote?: (optionId: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
  const isExpired = poll.expiresAt && new Date() > poll.expiresAt

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{totalVotes} votes</span>
          <span>•</span>
          <span>{poll.options.length} options</span>
          {poll.expiresAt && (
            <>
              <span>•</span>
              <span>
                {isExpired ? "Expired" : `Expires ${poll.expiresAt.toLocaleDateString()}`}
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{option.text}</span>
                  <span className="text-muted-foreground">
                    {option.votes} votes ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href={`/polls/${poll.id}`}>
              View Details
            </Link>
          </Button>
          {!isExpired && onVote && (
            <Button size="sm">
              Vote Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { ActivePoll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PollCardProps {
  poll: ActivePoll
  onVote?: (optionId: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const totalVotes = poll.total_votes
  const isExpired = poll.expires_at && new Date() > new Date(poll.expires_at)

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
          <span>{poll.option_count} options</span>
          {poll.expires_at && (
            <>
              <span>•</span>
              <span>
                {isExpired ? "Expired" : `Expires ${new Date(poll.expires_at).toLocaleDateString()}`}
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <p>Created by: {poll.creator_name}</p>
            <p>Created: {new Date(poll.created_at).toLocaleDateString()}</p>
            {poll.allow_multiple_votes && (
              <p className="text-blue-600">Multiple votes allowed</p>
            )}
          </div>
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

"use client"

import { CreatePollForm } from "@/components/polls/create-poll-form"

export default function CreatePollPage() {
  const handleCreatePoll = async (data: any) => {
    // TODO: Implement poll creation logic
    console.log("Creating poll:", data)
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
        
        <CreatePollForm onSubmit={handleCreatePoll} />
      </div>
    </div>
  )
}

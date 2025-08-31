// Re-export database types for backward compatibility
export type {
  User,
  Poll,
  PollOption,
  Vote,
  PollResult,
  ActivePoll,
  PollWithOptions,
  PollWithResults,
  UserWithPolls,
  VoteWithDetails
} from './database'

// Legacy interfaces for backward compatibility (deprecated)
export interface LegacyUser {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface LegacyPoll {
  id: string
  title: string
  description?: string
  options: LegacyPollOption[]
  createdBy: string
  isActive: boolean
  allowMultipleVotes: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface LegacyPollOption {
  id: string
  text: string
  votes: number
}

export interface LegacyVote {
  id: string
  pollId: string
  userId: string
  optionId: string
  createdAt: Date
}

export interface CreatePollRequest {
  title: string
  description?: string
  options: string[]
  allowMultipleVotes: boolean
  expiresAt?: Date
}

export interface AuthResponse {
  user: any // Using any for now since this is legacy
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

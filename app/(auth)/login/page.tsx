"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function LoginPage() {
  const handleLogin = async (data: any) => {
    // TODO: Implement login logic
    console.log("Login attempt:", data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Welcome back to PollApp</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Sign in to your account
          </h1>
          <p className="text-lg text-gray-600">
            Continue creating and voting on polls
          </p>
        </div>
        
        {/* Login Form */}
        <LoginForm onSubmit={handleLogin} />
        
        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
            </span>
            <Button variant="link" asChild className="text-blue-600 hover:text-blue-700 font-medium">
              <Link href="/register">
                Sign up here
              </Link>
            </Button>
          </div>
          
          <div className="pt-4">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-800">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function RegisterPage() {
  const handleRegister = async (data: any) => {
    // TODO: Implement registration logic
    console.log("Registration attempt:", data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Join the PollApp community</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Create your account
          </h1>
          <p className="text-lg text-gray-600">
            Start creating and voting on polls today
          </p>
        </div>
        
        {/* Register Form */}
        <RegisterForm onSubmit={handleRegister} />
        
        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <Button variant="link" asChild className="text-blue-600 hover:text-blue-700 font-medium">
              <Link href="/login">
                Sign in here
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

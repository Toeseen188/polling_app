"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, Plus, Home, User, LogOut, Settings, Bell } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Polls", href: "/dashboard/polls", icon: BarChart3 },
  { name: "Create Poll", href: "/polls/create", icon: Plus },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <nav className="flex flex-col space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-12 text-base font-medium transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl" 
                  : "hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        )
      })}
      
      <div className="pt-6 mt-auto border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start h-12 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}

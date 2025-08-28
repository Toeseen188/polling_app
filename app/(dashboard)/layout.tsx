import { Navigation } from "@/components/dashboard/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white/90 backdrop-blur-sm shadow-xl min-h-screen p-6 border-r border-gray-200/50">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PollApp</h1>
                <p className="text-sm text-gray-600">Your polling dashboard</p>
              </div>
            </div>
          </div>
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}

import { AuthProvider } from "@/components/auth/auth-provider"
import { Sidebar } from "@/components/layout/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}


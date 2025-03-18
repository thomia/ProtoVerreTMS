import Dashboard from '@/components/dashboard/dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-0 overflow-hidden bg-gray-950">
      <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-6">
          <Dashboard />
        </div>
      </div>
    </main>
  )
} 
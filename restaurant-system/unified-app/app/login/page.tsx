'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard (no login required)
    router.push('/admin')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Restaurant System</h1>
          <p className="text-gray-600">Authentication Disabled</p>
          <p className="text-sm text-green-600 mt-2">Redirecting to admin panel...</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-2">✨ No Login Required!</p>
          <p>All interfaces are now publicly accessible:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• Admin Dashboard</li>
            <li>• Kitchen Display</li>
            <li>• Cashier Terminal</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-green-600 hover:underline text-sm">
            ← Back to Customer Menu
          </a>
        </div>
      </div>
    </div>
  )
}

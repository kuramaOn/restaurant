'use client'

import Link from 'next/link'

export default function HomePage() {
  const apps = [
    {
      name: 'Admin Panel',
      description: 'Restaurant management dashboard for managers and staff',
      href: '/admin',
      icon: '👨‍💼',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Customer Menu',
      description: 'Browse menu and place orders',
      href: '/menu',
      icon: '🍽️',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Cashier Terminal',
      description: 'Point of sale system for cashiers',
      href: '/cashier',
      icon: '💰',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Kitchen Display',
      description: 'Order display for kitchen staff',
      href: '/kitchen',
      icon: '👨‍🍳',
      color: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                🍽️ Restaurant Management System
              </h1>
              <p className="text-gray-400 mt-1">
                Complete solution for restaurant operations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Choose Your Application
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select the application you want to access. Each module is designed for specific user roles.
          </p>
        </div>

        {/* App Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{app.icon}</div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  {app.name}
                </h3>
                <p className="text-gray-400">
                  {app.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            System Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="text-white font-semibold mb-1">Real-time Updates</h4>
              <p className="text-gray-400 text-sm">Live order updates across all modules</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="text-white font-semibold mb-1">Secure Access</h4>
              <p className="text-gray-400 text-sm">Role-based authentication system</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="text-white font-semibold mb-1">Mobile Friendly</h4>
              <p className="text-gray-400 text-sm">Responsive design for all devices</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>Restaurant Management System v1.0</p>
            <p className="text-sm mt-2">Powered by Next.js, NestJS & Vercel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

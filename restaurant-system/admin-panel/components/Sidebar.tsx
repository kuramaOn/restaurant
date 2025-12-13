'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/dashboard' },
  { icon: '🍽️', label: 'Menu Items', href: '/dashboard/menu' },
  { icon: '📦', label: 'Orders', href: '/dashboard/orders' },
  { icon: '🪑', label: 'Tables', href: '/dashboard/tables' },
  { icon: '📱', label: 'QR Codes', href: '/dashboard/qr-codes', badge: 'NEW', highlight: true },
  { icon: '👥', label: 'Customers', href: '/dashboard/customers' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900">🍽️ Admin Panel</h1>
        <p className="text-sm text-gray-600 mt-1">Restaurant Management</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : item.highlight
                      ? 'text-gray-700 hover:bg-gray-50 border-2 border-blue-200 bg-blue-50/50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="/cashier"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
          >
            <span className="text-xl">💰</span>
            <span>Cashier Terminal</span>
            <span className="ml-auto">↗</span>
          </a>
        </div>
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

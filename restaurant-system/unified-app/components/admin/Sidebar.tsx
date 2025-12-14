'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'

const menuItems = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🍽️', label: 'Menu Items', href: '/admin/menu' },
  { icon: '📦', label: 'Orders', href: '/admin/orders' },
  { icon: '🪑', label: 'Tables', href: '/admin/tables' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
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
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            href="/cashier"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-semibold"
          >
            <span className="text-xl">💰</span>
            <span>Cashier Terminal</span>
            <span className="ml-auto">→</span>
          </Link>
          
          <Link
            href="/kitchen"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold mt-2"
          >
            <span className="text-xl">🍳</span>
            <span>Kitchen Display</span>
            <span className="ml-auto">→</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition mb-2"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Customer Menu</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Back to Menu</span>
        </button>
      </div>
    </aside>
  )
}

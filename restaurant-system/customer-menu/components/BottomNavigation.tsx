'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { 
      icon: '🏠', 
      label: 'Menu', 
      path: '/',
      active: pathname === '/'
    },
    { 
      icon: '🛒', 
      label: 'Cart', 
      path: '/cart',
      badge: cartCount,
      active: pathname === '/cart'
    },
  ]

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
        <div className="grid grid-cols-2 h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                item.active
                  ? 'text-green-600'
                  : 'text-gray-500 active:bg-gray-100'
              }`}
            >
              <div className="relative">
                <span className="text-2xl">{item.icon}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${item.active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

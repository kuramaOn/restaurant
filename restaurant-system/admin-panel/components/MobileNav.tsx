'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)

  const mainNavItems = [
    { 
      icon: '📊', 
      label: 'Dashboard', 
      path: '/dashboard',
      active: pathname === '/dashboard'
    },
    { 
      icon: '📋', 
      label: 'Orders', 
      path: '/dashboard/orders',
      active: pathname === '/dashboard/orders'
    },
    { 
      icon: '🍽️', 
      label: 'Menu', 
      path: '/dashboard/menu',
      active: pathname === '/dashboard/menu'
    },
    { 
      icon: '⋮', 
      label: 'More', 
      action: () => setShowMore(true),
      active: false
    }
  ]

  const moreNavItems = [
    { icon: '🪑', label: 'Tables', path: '/dashboard/tables' },
    { icon: '📱', label: 'QR Codes', path: '/dashboard/qr-codes' },
    { icon: '👥', label: 'Customers', path: '/dashboard/customers' },
  ]

  return (
    <>
      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          {mainNavItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.path ? router.push(item.path) : item.action?.()}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative min-h-[56px] ${
                item.active
                  ? 'text-blue-600'
                  : 'text-gray-500 active:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-xs font-medium ${item.active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              {item.active && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-b-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* More Menu Modal */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setShowMore(false)}
        >
          <div 
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3 border-b border-gray-200">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* More Menu Items */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {moreNavItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.path)
                    setShowMore(false)
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[56px] min-w-[56px]"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMore(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors min-h-[56px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'

export default function FloatingActionButton() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartCount === 0) return null

  return (
    <button
      onClick={() => router.push('/cart')}
      className="fixed bottom-24 right-4 md:bottom-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full shadow-2xl z-50 flex items-center gap-3 px-6 py-4 hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
    >
      <div className="relative">
        <span className="text-2xl">🛒</span>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartCount}
        </span>
      </div>
      <div className="text-left">
        <div className="text-xs opacity-90">View Cart</div>
        <div className="font-bold">${cartTotal.toFixed(2)}</div>
      </div>
    </button>
  )
}

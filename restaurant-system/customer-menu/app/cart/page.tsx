'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('DINE_IN')
  const [tableNumber, setTableNumber] = useState('')
  const [tableInfo, setTableInfo] = useState<{ tableId: string; tableNumber: number } | null>(null)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load table info from localStorage (set by QR code scan)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tableInfo')
      if (saved) {
        setTableInfo(JSON.parse(saved))
      }
    }
  }, [])

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (items.length === 0) return

    if (orderType === 'DINE_IN' && !tableNumber.trim()) {
      setError('Please enter your table number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        orderType,
        customerName: orderType === 'DINE_IN' ? `Table ${tableNumber}` : 'Takeaway Guest',
        tableId: tableInfo?.tableId,
        specialInstructions,
        items: items.map(item => {
          // Extract the actual menu item ID (handle custom IDs from customization modal)
          // UUID format: 8-4-4-4-12 characters
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
          const match = item.id.match(uuidPattern)
          const menuItemId = match ? match[0] : item.id
          
          return {
            menuItemId: menuItemId,
            quantity: item.quantity,
            customizations: item.customizations,
            specialInstructions: item.specialInstructions,
          }
        }),
      }

      console.log('Order data:', orderData) // Debug log

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Order failed - Status:', response.status)
        console.error('Error response:', errorText)
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || `Server error: ${response.status}`)
        } catch (e) {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      const order = await response.json()
      console.log('Order created successfully:', order)
      clearCart()
      router.push(`/order/${order.id}`)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to place order. Please try again.'
      setError(errorMessage)
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Link href="/" className="text-primary-600 hover:text-primary-700">
                ← Back to Menu
              </Link>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items from our menu!</p>
            <Link
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Browse Menu
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              ← Back to Menu
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Your Items ({items.length})</h2>
              </div>
              
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    {/* Item Image */}
                    {item.imageUrl && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    {/* Item Details */}
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-primary-600 font-semibold mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      {/* Customizations */}
                      {item.customizations && (
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {item.customizations.size && (
                            <p>• Size: <span className="capitalize font-medium">{item.customizations.size}</span></p>
                          )}
                          {item.customizations.spiceLevel && item.customizations.spiceLevel !== 'none' && (
                            <p>• Spice Level: <span className="capitalize font-medium">{item.customizations.spiceLevel}</span></p>
                          )}
                          {item.customizations.addOns && item.customizations.addOns.length > 0 && (
                            <p>• Add-ons: <span className="font-medium">
                              {item.customizations.addOns.map(a => a.name).join(', ')}
                            </span></p>
                          )}
                          {item.customizations.modifications && item.customizations.modifications.length > 0 && (
                            <p>• Modifications: <span className="font-medium">
                              {item.customizations.modifications.join(', ')}
                            </span></p>
                          )}
                          {item.customizations.specialInstructions && (
                            <p>• Note: <span className="italic">{item.customizations.specialInstructions}</span></p>
                          )}
                        </div>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          +
                        </button>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Checkout</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Order Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('DINE_IN')}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition ${
                      orderType === 'DINE_IN'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🪑 Dine-in
                  </button>
                  <button
                    onClick={() => setOrderType('TAKEAWAY')}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition ${
                      orderType === 'TAKEAWAY'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🥡 Takeaway
                  </button>
                </div>
              </div>

              {/* Table Number Input for Dine-in */}
              {orderType === 'DINE_IN' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number *
                  </label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg text-center font-semibold"
                    placeholder="Enter your table number"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any special requests?"
                  rows={2}
                />
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing an order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

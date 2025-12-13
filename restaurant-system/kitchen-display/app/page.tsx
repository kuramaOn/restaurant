'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { getToken, getAuthHeaders, removeToken } from '@/lib/auth'

export default function KitchenDisplay() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetchOrders()

    // Connect to WebSocket for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    socket.on('new_order', (order) => {
      fetchOrders()
      playNotificationSound()
    })

    socket.on('order_updated', () => {
      fetchOrders()
    })

    return () => {
      socket.disconnect()
    }
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/kitchen`, {
        headers: {
          ...getAuthHeaders(),
        }
      })
      if (response.status === 401) {
        removeToken()
        router.push('/login')
        return
      }
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      })
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const getElapsedTime = (createdAt: string) => {
    const elapsed = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000 / 60)
    return elapsed
  }

  const getUrgencyLevel = (createdAt: string, estimatedTime: number = 15) => {
    const elapsed = getElapsedTime(createdAt)
    if (elapsed > estimatedTime * 1.5) return 'urgent'
    if (elapsed > estimatedTime) return 'warning'
    return 'normal'
  }

  const getCardColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-900 border-red-500'
      case 'warning':
        return 'bg-yellow-900 border-yellow-500'
      default:
        return 'bg-gray-800 border-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white text-xl">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Audio element for notifications */}
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjyU2O+LRQgPUK3k7eJ8MwceZ7rm" />

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🍳 Kitchen Display System</h1>
            <p className="text-gray-400 mt-1">Active Orders: {orders.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                soundEnabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
            </button>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
            >
              🚪 Logout
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Orders Grid */}
      <main className="max-w-screen-2xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">All Clear!</h2>
            <p className="text-gray-500">No active orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map((order) => {
              const urgency = getUrgencyLevel(order.createdAt)
              const elapsedTime = getElapsedTime(order.createdAt)

              return (
                <div
                  key={order.id}
                  className={`border-2 rounded-xl p-6 ${getCardColor(urgency)} transition-all duration-300 hover:scale-105`}
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{order.orderNumber}</h3>
                      {order.table && (
                        <p className="text-lg text-gray-300">Table {order.table.tableNumber}</p>
                      )}
                      {order.orderType === 'TAKEAWAY' && (
                        <p className="text-lg text-blue-300">🥡 Takeaway</p>
                      )}
                      {order.orderType === 'DELIVERY' && (
                        <p className="text-lg text-green-300">🚚 Delivery</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${
                        urgency === 'urgent' ? 'text-red-400 animate-pulse' :
                        urgency === 'warning' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {elapsedTime} min
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 space-y-3">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold text-lg">
                            {item.quantity}x {item.menuItem?.name || 'Item'}
                          </span>
                        </div>
                        {item.specialInstructions && (
                          <div className="mt-2 p-2 bg-yellow-900 border border-yellow-600 rounded text-yellow-200 text-sm">
                            ⚠️ {item.specialInstructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Special Instructions */}
                  {order.specialInstructions && (
                    <div className="mb-4 p-3 bg-orange-900 border border-orange-600 rounded">
                      <p className="font-semibold text-orange-200 text-sm mb-1">📝 Special Instructions:</p>
                      <p className="text-orange-100 text-sm">{order.specialInstructions}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-semibold text-lg"
                      >
                        ✓ Confirm
                      </button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition font-semibold text-lg"
                      >
                        👨‍🍳 Start Preparing
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-semibold text-lg"
                      >
                        ✓ Mark Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <div className="text-center py-3 bg-green-600 rounded-lg">
                        <span className="text-lg font-bold">🎉 READY FOR PICKUP</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

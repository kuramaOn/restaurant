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
      if (!response.ok) {
        console.error('Failed to fetch orders')
        return
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play()
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchOrders()
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const pendingOrders = orders.filter(o => o.status === 'PENDING')
  const preparingOrders = orders.filter(o => o.status === 'PREPARING')
  const readyOrders = orders.filter(o => o.status === 'READY')

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🍳 Kitchen Display</h1>
            <p className="text-gray-400">Real-time order management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-lg transition ${
                soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      </header>

      {/* Audio for notifications */}
      <audio ref={audioRef} src="/notification.mp3" />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Column */}
            <div className="space-y-4">
              <div className="bg-yellow-600 text-white px-4 py-3 rounded-lg">
                <h2 className="text-xl font-bold">📋 Pending ({pendingOrders.length})</h2>
              </div>
              {pendingOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600">
                        Table {order.table?.tableNumber || 'N/A'}
                      </p>
                    </div>
                    <span className="text-3xl">⏰</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="border-b pb-2">
                        <div className="flex justify-between font-semibold">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                        </div>
                        {item.customizations && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.customizations}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg"
                  >
                    Start Preparing
                  </button>
                </div>
              ))}
            </div>

            {/* Preparing Column */}
            <div className="space-y-4">
              <div className="bg-blue-600 text-white px-4 py-3 rounded-lg">
                <h2 className="text-xl font-bold">👨‍🍳 Preparing ({preparingOrders.length})</h2>
              </div>
              {preparingOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 border-4 border-blue-400">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600">
                        Table {order.table?.tableNumber || 'N/A'}
                      </p>
                    </div>
                    <span className="text-3xl animate-pulse">🔥</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="border-b pb-2">
                        <div className="flex justify-between font-semibold">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                        </div>
                        {item.customizations && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.customizations}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-lg"
                  >
                    Mark as Ready
                  </button>
                </div>
              ))}
            </div>

            {/* Ready Column */}
            <div className="space-y-4">
              <div className="bg-green-600 text-white px-4 py-3 rounded-lg">
                <h2 className="text-xl font-bold">✅ Ready ({readyOrders.length})</h2>
              </div>
              {readyOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 border-4 border-green-400">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600">
                        Table {order.table?.tableNumber || 'N/A'}
                      </p>
                    </div>
                    <span className="text-3xl">🎉</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.orderItems?.map((item: any) => (
                      <div key={item.id} className="border-b pb-2">
                        <div className="flex justify-between font-semibold">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-gray-600 font-semibold">
                    Waiting for pickup
                  </p>
                </div>
              ))}
            </div>
          </div>

          {orders.length === 0 && (
            <div className="text-center text-white py-20">
              <div className="text-6xl mb-4">😴</div>
              <h2 className="text-2xl font-bold mb-2">All caught up!</h2>
              <p className="text-gray-400">No orders to prepare right now</p>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

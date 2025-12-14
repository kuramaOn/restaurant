'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getAuthHeaders, removeToken } from '@/lib/auth'
import { io } from 'socket.io-client'

interface Order {
  id: string
  orderNumber: string
  tableId: string
  customerName?: string
  status: string
  total: string
  paymentStatus: string
  createdAt: string
  table?: {
    tableNumber: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: string
    menuItem: {
      name: string
    }
    customizations?: any
  }>
}

export default function CashierTerminal() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('UNPAID')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()

    // Real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    socket.on('new_order', () => {
      fetchOrders()
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: getAuthHeaders(),
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

  const handlePayment = async (orderId: string, paymentMethod: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/payment`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          paymentStatus: 'PAID',
        }),
      })
      
      fetchOrders()
      setSelectedOrder(null)
      alert('Payment processed successfully!')
    } catch (error) {
      console.error('Failed to process payment:', error)
      alert('Failed to process payment')
    }
  }

  const handleLogout = () => {
    router.push('/')
  }

  const filteredOrders = orders
    .filter(order => {
      if (filter === 'UNPAID') return order.paymentStatus !== 'PAID'
      if (filter === 'PAID') return order.paymentStatus === 'PAID'
      return true
    })
    .filter(order => {
      if (!searchTerm) return true
      return (
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table?.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💰 Cashier Terminal</h1>
            <p className="text-green-100">Payment processing</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            🏠 Back to Menu
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('UNPAID')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'UNPAID'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Unpaid ({orders.filter(o => o.paymentStatus !== 'PAID').length})
            </button>
            <button
              onClick={() => setFilter('PAID')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'PAID'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Paid ({orders.filter(o => o.paymentStatus === 'PAID').length})
            </button>
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'ALL'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({orders.length})
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search by order # or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition ${
                order.paymentStatus === 'PAID' ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-gray-600">
                    Table {order.table?.tableNumber || 'N/A'}
                  </p>
                  {order.customerName && (
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                {order.orderItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between text-gray-700">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span>${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}</span>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <p className="text-gray-500 text-xs">
                    +{order.orderItems.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
                
                {order.paymentStatus !== 'PAID' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrder(order)
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Process Payment
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-semibold">
                        ${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    ${parseFloat(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              {selectedOrder.paymentStatus !== 'PAID' && (
                <div>
                  <h3 className="font-semibold mb-3">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePayment(selectedOrder.id, 'CASH')}
                      className="bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      💵 Cash
                    </button>
                    <button
                      onClick={() => handlePayment(selectedOrder.id, 'CARD')}
                      className="bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      💳 Card
                    </button>
                    <button
                      onClick={() => handlePayment(selectedOrder.id, 'DIGITAL')}
                      className="bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition col-span-2"
                    >
                      📱 Digital Wallet
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder.paymentStatus === 'PAID' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-semibold">
                  ✓ Payment Already Processed
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

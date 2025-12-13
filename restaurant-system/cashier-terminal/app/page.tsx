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
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

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
        headers: getAuthHeaders()
      })
      
      if (response.status === 401) {
        removeToken()
        router.push('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('Orders data is not an array:', data)
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (orderId: string, paymentMethod: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          paymentStatus: 'PAID',
          paymentMethod 
        })
      })

      if (response.ok) {
        await fetchOrders()
        setSelectedOrder(null)
        // Show success notification
        alert('Payment successful!')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const filteredOrders = orders.filter(order => {
    const matchesPaymentStatus = filter === 'ALL' || order.paymentStatus === filter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table?.tableNumber.toString().includes(searchTerm) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesPaymentStatus && matchesSearch
  })

  const unpaidOrders = orders.filter(o => o.paymentStatus === 'PENDING')
  const paidToday = orders.filter(o => {
    const today = new Date().toDateString()
    return o.paymentStatus === 'PAID' && new Date(o.createdAt).toDateString() === today
  })
  const totalRevenue = paidToday.reduce((sum, o) => sum + parseFloat(o.total), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💰 Cashier Terminal</h1>
              <p className="text-gray-600 text-sm mt-1">Process payments and manage orders</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                🔄 Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unpaid Orders</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{unpaidOrders.length}</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid Today</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{paidToday.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Revenue</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by order #, table, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filter === 'PENDING'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unpaid
              </button>
              <button
                onClick={() => setFilter('PAID')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filter === 'PAID'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setFilter('ALL')}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  filter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition hover:shadow-lg cursor-pointer ${
                order.paymentStatus === 'PENDING' ? 'border-red-300' : 'border-green-300'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">#{order.orderNumber}</h3>
                  <p className="text-gray-600">Table {order.table?.tableNumber || 'N/A'}</p>
                  {order.customerName && (
                    <p className="text-gray-600 text-sm">{order.customerName}</p>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menuItem?.name || 'Item'}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${parseFloat(order.total).toFixed(2)}
                  </span>
                </div>

                {order.paymentStatus === 'PENDING' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrder(order)
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    💳 Process Payment
                  </button>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {selectedOrder && selectedOrder.paymentStatus === 'PENDING' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Process Payment</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Order:</span>
                <span className="font-bold">#{selectedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Table:</span>
                <span className="font-bold">Table {selectedOrder.table?.tableNumber}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Items:</span>
                <span className="font-bold">{selectedOrder.orderItems?.length || 0} items</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="text-xl font-bold">Total Amount:</span>
                <span className="text-3xl font-bold text-green-600">
                  ${parseFloat(selectedOrder.total).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handlePayment(selectedOrder.id, 'CASH')}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-bold text-lg"
              >
                💵 Cash Payment
              </button>
              <button
                onClick={() => handlePayment(selectedOrder.id, 'CARD')}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
              >
                💳 Card Payment
              </button>
              <button
                onClick={() => handlePayment(selectedOrder.id, 'MOBILE')}
                className="w-full bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 transition font-bold text-lg"
              >
                📱 Mobile Payment
              </button>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

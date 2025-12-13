'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'
import { io } from 'socket.io-client'
import PaymentModal from '@/components/PaymentModal'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    fetchOrders()

    // Connect to WebSocket for real-time updates
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
  }, [])

  const fetchOrders = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: { ...headers, 'Content-Type': 'application/json' },
      })

      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login')
        window.location.href = '/login'
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

  const updateOrderStatus = async (orderId: string, status: string) => {
    const headers = getAuthHeaders()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800'
      case 'READY':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-red-100 text-red-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOpenPaymentModal = (order: any) => {
    setSelectedOrder(order)
    setPaymentModalOpen(true)
  }

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter((o: any) => o.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders Management</h1>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6 p-2 flex gap-2 overflow-x-auto">
        {['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
            <span className="ml-2 text-sm">
              ({status === 'ALL' ? orders.length : orders.filter((o: any) => o.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus === 'PAID' ? '✓ PAID' : '⚠ UNPAID'}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4 pb-4 border-b">
              <div className="text-sm space-y-1">
                <p><span className="text-gray-600">Customer:</span> <span className="font-medium">{order.customerName || 'Guest'}</span></p>
                <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{order.customerPhone}</span></p>
                <p><span className="text-gray-600">Type:</span> <span className="font-medium capitalize">{order.orderType.replace('_', '-')}</span></p>
                {order.table && (
                  <p><span className="text-gray-600">Table:</span> <span className="font-medium">{order.table.tableNumber}</span></p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
              <div className="space-y-1">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.quantity}x {item.menuItem?.name || 'Item'}
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="mb-4 p-2 bg-yellow-50 rounded text-sm">
                <p className="font-semibold text-yellow-900">Special Instructions:</p>
                <p className="text-yellow-800">{order.specialInstructions}</p>
              </div>
            )}

            {/* Total */}
            <div className="mb-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${parseFloat(order.total).toFixed(2)}</span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Payment Method:</span>
                  <span className="font-medium">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              )}
            </div>

            {/* Payment Action */}
            {order.paymentStatus === 'PENDING' && order.status !== 'CANCELLED' && (
              <button
                onClick={() => handleOpenPaymentModal(order)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold mb-3 flex items-center justify-center gap-2"
              >
                <span>💳</span>
                <span>Process Payment</span>
              </button>
            )}

            {/* Status Actions */}
            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
              <div className="space-y-2">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Confirm Order
                  </button>
                )}
                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'READY')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Mark as Ready
                  </button>
                )}
                {order.status === 'READY' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition font-medium"
                  >
                    Complete Order
                  </button>
                )}
                {order.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this order?')) {
                        updateOrderStatus(order.id, 'CANCELLED')
                      }
                    }}
                    className="w-full border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No {filter === 'ALL' ? '' : filter.toLowerCase()} orders found
        </div>
      )}

      {/* Payment Modal */}
      {selectedOrder && (
        <PaymentModal
          order={selectedOrder}
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setSelectedOrder(null)
          }}
          onPaymentComplete={() => {
            fetchOrders()
          }}
        />
      )}
    </div>
  )
}

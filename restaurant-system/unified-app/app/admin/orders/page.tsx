'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'
import { io } from 'socket.io-client'

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchOrders()

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter)

  const filterButtons = [
    { label: 'All', value: 'ALL', count: orders.length },
    { label: 'Pending', value: 'PENDING', count: orders.filter(o => o.status === 'PENDING').length },
    { label: 'Preparing', value: 'PREPARING', count: orders.filter(o => o.status === 'PREPARING').length },
    { label: 'Ready', value: 'READY', count: orders.filter(o => o.status === 'READY').length },
    { label: 'Served', value: 'SERVED', count: orders.filter(o => o.status === 'SERVED').length },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Monitor and manage all restaurant orders</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
              filter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Table {order.table?.tableNumber || 'N/A'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'PREPARING' ? 'bg-blue-100 text-blue-800' :
                order.status === 'READY' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.orderItems?.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.menuItem?.name}
                  </span>
                  <span className="font-semibold">
                    ${(item.quantity * parseFloat(item.unitPrice)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-lg font-bold text-green-600">
                  ${parseFloat(order.total).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'
import { io } from 'socket.io-client'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    activeOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()

    // Connect to WebSocket for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    socket.on('new_order', () => {
      fetchData()
    })

    socket.on('order_updated', () => {
      fetchData()
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders()
      
      const [ordersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { ...headers, 'Content-Type': 'application/json' },
        }),
      ])

      if (ordersRes.status === 401) {
        console.error('Unauthorized - redirecting to login')
        window.location.href = '/login'
        return
      }

      if (!ordersRes.ok) {
        throw new Error('Failed to fetch orders')
      }

      const orders = await ordersRes.json()
      
      // Ensure orders is an array
      if (!Array.isArray(orders)) {
        console.error('Orders is not an array:', orders)
        setRecentOrders([])
        return
      }
      
      // Calculate stats
      const pending = orders.filter((o: any) => o.status === 'PENDING').length
      const active = orders.filter((o: any) => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
      ).length

      const today = new Date().toDateString()
      const todayOrders = orders.filter((o: any) => 
        new Date(o.createdAt).toDateString() === today
      )
      const revenue = todayOrders.reduce((sum: number, o: any) => 
        sum + parseFloat(o.total), 0
      )

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        todayRevenue: revenue,
        activeOrders: active,
      })

      setRecentOrders(orders.slice(0, 10))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-orange-600">{stats.activeOrders}</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-3xl font-bold text-green-600">${stats.todayRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.customerName || order.customer?.firstName || 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                    {order.orderType.replace('_', '-')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {recentOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
    
    // Connect to WebSocket for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    socket.on('order_updated', (data) => {
      if (data.orderId === orderId) {
        fetchOrder()
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStep = (status: string) => {
    const steps = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED']
    return steps.indexOf(status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500'
      case 'CONFIRMED':
        return 'bg-blue-500'
      case 'PREPARING':
        return 'bg-orange-500'
      case 'READY':
        return 'bg-green-500'
      case 'COMPLETED':
        return 'bg-green-600'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order not found</h2>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getStatusStep(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm">
                ← Back to Menu
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Order Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">✅</div>
            <div>
              <h2 className="text-xl font-semibold text-green-900">Order Placed Successfully!</h2>
              <p className="text-green-700">Order #{order.orderNumber}</p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-6">Order Status</h3>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div 
              className={`absolute left-4 top-0 w-0.5 ${getStatusColor(order.status)} transition-all duration-500`}
              style={{ height: `${(currentStep / 4) * 100}%` }}
            ></div>

            {/* Status Steps */}
            <div className="space-y-6 relative">
              {[
                { status: 'PENDING', label: 'Order Received', icon: '📝' },
                { status: 'CONFIRMED', label: 'Order Confirmed', icon: '✓' },
                { status: 'PREPARING', label: 'Preparing Your Food', icon: '👨‍🍳' },
                { status: 'READY', label: 'Ready for Pickup', icon: '🎉' },
                { status: 'COMPLETED', label: 'Completed', icon: '✅' },
              ].map((step, index) => {
                const isActive = getStatusStep(order.status) >= index
                const isCurrent = order.status === step.status

                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10 transition-all ${
                        isActive
                          ? `${getStatusColor(order.status)} text-white`
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isActive ? step.icon : index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className={`font-medium ${isCurrent ? 'text-primary-600' : isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-gray-600">In progress...</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Type</span>
              <span className="font-medium capitalize">{order.orderType.replace('_', '-')}</span>
            </div>
            {order.table && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Table</span>
                <span className="font-medium">Table {order.table.tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone</span>
              <span className="font-medium">{order.customerPhone}</span>
            </div>
            {order.specialInstructions && (
              <div className="text-sm">
                <span className="text-gray-600">Special Instructions:</span>
                <p className="font-medium mt-1">{order.specialInstructions}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Items</h4>
            <div className="space-y-2">
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

          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary-600">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Need help? Call us at <a href="tel:+1234567890" className="text-primary-600 font-medium">+1 (234) 567-890</a>
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Order Again
          </Link>
        </div>
      </main>
    </div>
  )
}

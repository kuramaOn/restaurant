'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { io } from 'socket.io-client'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  table?: {
    tableNumber: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    menuItem: {
      name: string
    }
  }>
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: '📝' },
  { key: 'PREPARING', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'READY', label: 'Ready', icon: '✅' },
  { key: 'SERVED', label: 'Served', icon: '🍽️' },
]

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()

    // Real-time updates
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000')
    
    socket.on('order_updated', (updatedOrder) => {
      if (updatedOrder.id === orderId) {
        setOrder(updatedOrder)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`)
      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === order?.status)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Order not found</p>
          <Link href="/" className="text-green-600 hover:underline">
            Return to Menu
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-green-100 hover:text-white mb-2 inline-block">
            ← Back to Menu
          </Link>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-green-100">Table {order.table?.tableNumber}</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">Order Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStep
                const isCurrent = index === currentStep

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-sm text-center font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{item.menuItem.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-green-600">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-green-600">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Order Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Table:</span>
              <span className="font-semibold">{order.table?.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Time:</span>
              <span className="font-semibold">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

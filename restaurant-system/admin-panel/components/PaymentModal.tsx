'use client'

import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/auth'
import ReceiptPrint from './ReceiptPrint'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  menuItem?: {
    name: string
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string | null
  customerPhone: string | null
  tableId: string | null
  orderType: string
  table?: {
    tableNumber: string
  }
  subtotal: string
  tax: string
  discount: string
  tip: string
  total: string
  paymentMethod: string | null
  paymentStatus: string
  createdAt: string
  completedAt?: string | null
  orderItems: OrderItem[]
}

interface PaymentModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: () => void
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: '💵 Cash', icon: '💵' },
  { value: 'CREDIT_CARD', label: '💳 Credit Card', icon: '💳' },
  { value: 'DEBIT_CARD', label: '💳 Debit Card', icon: '💳' },
  { value: 'MOBILE_PAYMENT', label: '📱 Mobile Payment', icon: '📱' },
]

export default function PaymentModal({ order, isOpen, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [amountReceived, setAmountReceived] = useState('')
  const [tips, setTips] = useState('0')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [updatedOrder, setUpdatedOrder] = useState<Order | null>(null)

  const total = parseFloat(order.total)
  const received = parseFloat(amountReceived) || 0
  const tipAmount = parseFloat(tips) || 0
  const change = received - (total + tipAmount)

  useEffect(() => {
    if (isOpen) {
      setAmountReceived('')
      setTips('0')
      setError('')
      setPaymentSuccess(false)
      setUpdatedOrder(null)
    }
  }, [isOpen])

  const handleProcessPayment = async () => {
    if (paymentMethod === 'CASH' && received < total + tipAmount) {
      setError('Amount received is less than total amount')
      return
    }

    setProcessing(true)
    setError('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/payment`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            paymentMethod,
            paymentStatus: 'PAID',
            tip: tipAmount,
            amountReceived: paymentMethod === 'CASH' ? received : total + tipAmount,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      const updatedOrderData = await response.json()
      setUpdatedOrder({
        ...order,
        ...updatedOrderData,
        paymentMethod,
        tip: tipAmount.toString(),
        total: (total + tipAmount).toFixed(2),
      })
      setPaymentSuccess(true)
      onPaymentComplete()
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  if (!isOpen) return null

  // Show success screen with receipt after payment
  if (paymentSuccess && updatedOrder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
            <div className="text-center">
              <div className="text-5xl mb-2">✅</div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-green-100 mt-1">Order #{order.orderNumber}</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Payment Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold text-gray-900">
                    {paymentMethod === 'CASH' ? '💵 Cash' : 
                     paymentMethod === 'CREDIT_CARD' ? '💳 Credit Card' :
                     paymentMethod === 'DEBIT_CARD' ? '💳 Debit Card' : '📱 Mobile Payment'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Paid:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ${(total + tipAmount).toFixed(2)}
                  </span>
                </div>
                {paymentMethod === 'CASH' && received > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Received:</span>
                      <span className="font-semibold text-gray-900">${received.toFixed(2)}</span>
                    </div>
                    {change >= 0 && (
                      <div className="flex justify-between pt-2 border-t border-green-300">
                        <span className="text-gray-600">Change Given:</span>
                        <span className="font-bold text-gray-900">${change.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip Amount:</span>
                    <span className="font-semibold text-gray-900">${tipAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Print Component */}
            <ReceiptPrint 
              order={updatedOrder} 
              amountReceived={paymentMethod === 'CASH' ? received : undefined}
              change={paymentMethod === 'CASH' && change >= 0 ? change : undefined}
              autoPrint={true}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show payment form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">💳 Process Payment</h2>
              <p className="text-green-100 mt-1">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Table:</span>
              <span className="font-semibold text-gray-900">
                {order.table ? `Table ${order.table.tableNumber}` : 'Takeaway'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer:</span>
              <span className="font-semibold text-gray-900">
                {order.customerName || 'Walk-in'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.menuItem?.name || 'Item'}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-900">${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${parseFloat(order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span className="text-gray-900">TOTAL:</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === method.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-sm font-medium">{method.label.replace(/[^\w\s]/g, '')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === 'CASH' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Received *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {received > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-900 font-medium">Change:</span>
                    <span className={`text-2xl font-bold ${change >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      ${Math.abs(change).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tips (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              {[0, 5, 10, 15, 20].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setTips((total * percent / 100).toFixed(2))}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-green-100 rounded-lg text-sm font-medium transition"
                >
                  {percent}%
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Grand Total with Tips */}
          {tipAmount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-green-900 font-medium">Total with Tips:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${(total + tipAmount).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessPayment}
              disabled={processing || (paymentMethod === 'CASH' && !amountReceived)}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition font-semibold disabled:opacity-50"
            >
              {processing ? '⏳ Processing...' : '✅ Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRef, useEffect, useState } from 'react'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: string
  customizations?: string
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

interface ReceiptPrintProps {
  order: Order
  amountReceived?: number
  change?: number
  autoPrint?: boolean // Auto-open print dialog
}

export default function ReceiptPrint({ order, amountReceived, change, autoPrint = true }: ReceiptPrintProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(true)
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false)

  // Load auto-print preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('autoPrintReceipt')
    if (savedPreference !== null) {
      setAutoPrintEnabled(savedPreference === 'true')
    }
  }, [])

  // Auto-print on mount if enabled
  useEffect(() => {
    if (autoPrint && autoPrintEnabled && !hasAutoPrinted) {
      // Small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        window.print()
        setHasAutoPrinted(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [autoPrint, autoPrintEnabled, hasAutoPrinted])

  const handlePrint = () => {
    window.print()
  }

  const toggleAutoPrint = () => {
    const newValue = !autoPrintEnabled
    setAutoPrintEnabled(newValue)
    localStorage.setItem('autoPrintReceipt', newValue.toString())
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPaymentMethodDisplay = (method: string | null) => {
    const methods: Record<string, string> = {
      CASH: 'Cash',
      CREDIT_CARD: 'Credit Card',
      DEBIT_CARD: 'Debit Card',
      MOBILE_PAYMENT: 'Mobile Payment',
    }
    return method ? methods[method] || method : 'N/A'
  }

  return (
    <>
      {/* Print Button and Settings - Only visible on screen */}
      <div className="space-y-3 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
        >
          🖨️ Print Receipt
        </button>

        {/* Auto-Print Toggle */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Auto-print receipts</span>
            <span className="text-xs text-gray-500">(automatically opens print dialog)</span>
          </div>
          <button
            onClick={toggleAutoPrint}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoPrintEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoPrintEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {autoPrintEnabled && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">💡</span>
              <p className="text-xs text-blue-700">
                Auto-print is enabled. The print dialog will open automatically after payment completion.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Content - Hidden on screen, visible when printing */}
      <div ref={receiptRef} className="hidden print:block">
        <div className="receipt-container">
          {/* Header */}
          <div className="receipt-header">
            <h1 className="receipt-title">🍽️ RESTAURANT SYSTEM</h1>
            <p className="receipt-subtitle">Delicious Food, Great Service</p>
            <div className="receipt-info">
              <p>123 Restaurant Street, Food City</p>
              <p>Phone: (555) 123-4567</p>
              <p>www.restaurant-system.com</p>
            </div>
          </div>

          <div className="receipt-divider"></div>

          {/* Order Information */}
          <div className="receipt-section">
            <div className="receipt-row">
              <span>Receipt #:</span>
              <span className="receipt-bold">{order.orderNumber}</span>
            </div>
            <div className="receipt-row">
              <span>Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.completedAt && (
              <div className="receipt-row">
                <span>Completed:</span>
                <span>{formatDate(order.completedAt)}</span>
              </div>
            )}
            <div className="receipt-row">
              <span>Order Type:</span>
              <span>{order.orderType.replace('_', ' ')}</span>
            </div>
            {order.table && (
              <div className="receipt-row">
                <span>Table:</span>
                <span className="receipt-bold">Table {order.table.tableNumber}</span>
              </div>
            )}
            {order.customerName && (
              <div className="receipt-row">
                <span>Customer:</span>
                <span>{order.customerName}</span>
              </div>
            )}
            {order.customerPhone && (
              <div className="receipt-row">
                <span>Phone:</span>
                <span>{order.customerPhone}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider"></div>

          {/* Order Items */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">ORDER ITEMS</h2>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th className="text-left">Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item) => {
                  const itemTotal = parseFloat(item.unitPrice) * item.quantity
                  const customizations = item.customizations 
                    ? JSON.parse(item.customizations) 
                    : null

                  return (
                    <tr key={item.id}>
                      <td>
                        <div>{item.menuItem?.name || 'Item'}</div>
                        {customizations && Object.keys(customizations).length > 0 && (
                          <div className="receipt-customization">
                            {Object.entries(customizations).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                • {key}: {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">${parseFloat(item.unitPrice).toFixed(2)}</td>
                      <td className="text-right receipt-bold">${itemTotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="receipt-divider"></div>

          {/* Totals */}
          <div className="receipt-section">
            <div className="receipt-row">
              <span>Subtotal:</span>
              <span>${parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span>Tax (8%):</span>
              <span>${parseFloat(order.tax).toFixed(2)}</span>
            </div>
            {parseFloat(order.discount) > 0 && (
              <div className="receipt-row">
                <span>Discount:</span>
                <span>-${parseFloat(order.discount).toFixed(2)}</span>
              </div>
            )}
            {parseFloat(order.tip) > 0 && (
              <div className="receipt-row">
                <span>Tip:</span>
                <span>${parseFloat(order.tip).toFixed(2)}</span>
              </div>
            )}
            
            <div className="receipt-divider-thin"></div>
            
            <div className="receipt-row receipt-total">
              <span>TOTAL:</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-divider"></div>

          {/* Payment Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">PAYMENT</h2>
            <div className="receipt-row">
              <span>Method:</span>
              <span className="receipt-bold">{getPaymentMethodDisplay(order.paymentMethod)}</span>
            </div>
            <div className="receipt-row">
              <span>Status:</span>
              <span className="receipt-bold">{order.paymentStatus}</span>
            </div>
            {amountReceived && amountReceived > 0 && (
              <>
                <div className="receipt-row">
                  <span>Amount Received:</span>
                  <span>${amountReceived.toFixed(2)}</span>
                </div>
                {change !== undefined && change >= 0 && (
                  <div className="receipt-row receipt-change">
                    <span>Change:</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="receipt-divider"></div>

          {/* Footer */}
          <div className="receipt-footer">
            <p className="receipt-thank-you">Thank You for Dining with Us!</p>
            <p>Please visit us again soon</p>
            <p className="receipt-small">Follow us @restaurant_system</p>
            <p className="receipt-small">Rate your experience at: restaurant-system.com/feedback</p>
            <div className="receipt-barcode">
              <p className="receipt-small">Order: {order.orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the receipt */
          body * {
            visibility: hidden;
          }
          
          .receipt-container,
          .receipt-container * {
            visibility: visible;
          }
          
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm; /* Standard receipt width */
            padding: 10mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: #fff;
          }

          /* Remove margins and padding from body */
          @page {
            margin: 0;
            size: 80mm auto;
          }

          body {
            margin: 0;
            padding: 0;
          }
        }

        /* Receipt Styles (both screen and print) */
        .receipt-header {
          text-align: center;
          margin-bottom: 12px;
        }

        .receipt-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 4px 0;
          letter-spacing: 1px;
        }

        .receipt-subtitle {
          font-size: 12px;
          margin: 0 0 8px 0;
          font-style: italic;
        }

        .receipt-info {
          font-size: 10px;
          line-height: 1.3;
        }

        .receipt-info p {
          margin: 2px 0;
        }

        .receipt-divider {
          border-top: 2px dashed #000;
          margin: 10px 0;
        }

        .receipt-divider-thin {
          border-top: 1px solid #000;
          margin: 8px 0;
        }

        .receipt-section {
          margin: 10px 0;
        }

        .receipt-section-title {
          font-size: 13px;
          font-weight: bold;
          margin: 0 0 6px 0;
          text-align: center;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 11px;
        }

        .receipt-bold {
          font-weight: bold;
        }

        .receipt-total {
          font-size: 14px;
          font-weight: bold;
          margin-top: 8px;
        }

        .receipt-change {
          font-size: 13px;
          font-weight: bold;
          background: #f0f0f0;
          padding: 4px;
          margin-top: 4px;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
          margin: 6px 0;
        }

        .receipt-table th {
          border-bottom: 1px solid #000;
          padding: 4px 2px;
          font-weight: bold;
        }

        .receipt-table td {
          padding: 4px 2px;
          vertical-align: top;
        }

        .receipt-customization {
          margin-top: 2px;
          padding-left: 4px;
          font-style: italic;
          color: #555;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 12px;
          font-size: 10px;
        }

        .receipt-thank-you {
          font-size: 14px;
          font-weight: bold;
          margin: 8px 0;
        }

        .receipt-footer p {
          margin: 3px 0;
        }

        .receipt-small {
          font-size: 9px;
        }

        .receipt-barcode {
          margin-top: 10px;
          padding: 8px;
          border: 1px solid #000;
          text-align: center;
        }
      `}</style>
    </>
  )
}

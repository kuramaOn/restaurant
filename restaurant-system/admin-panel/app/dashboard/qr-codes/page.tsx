'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'

interface Table {
  id: string
  tableNumber: number
  capacity: number
  status: string
  location: string | null
}

interface QRCodeData {
  tableId: string
  tableNumber: number
  qrUrl: string
  qrData: string
}

export default function QRCodesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [qrCodes, setQrCodes] = useState<Map<string, QRCodeData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables`, {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setTables(data)
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (table: Table) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${table.id}/qr`, {
        headers: getAuthHeaders()
      })
      if (response.ok) {
        const data = await response.json()
        setQrCodes(prev => new Map(prev).set(table.id, data))
        setSelectedTable(table)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const generateAllQRCodes = async () => {
    setLoading(true)
    for (const table of tables) {
      await generateQRCode(table)
    }
    setLoading(false)
  }

  const printQRCode = (table: Table) => {
    const qr = qrCodes.get(table.id)
    if (!qr) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code - Table ${table.tableNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .qr-container {
              text-align: center;
              border: 3px solid #000;
              padding: 30px;
              border-radius: 10px;
              max-width: 400px;
            }
            h1 {
              font-size: 48px;
              margin: 0 0 10px 0;
              color: #333;
            }
            h2 {
              font-size: 72px;
              margin: 0 0 20px 0;
              color: #2563eb;
            }
            .qr-code {
              margin: 20px 0;
            }
            .instructions {
              font-size: 18px;
              color: #666;
              margin-top: 20px;
              line-height: 1.5;
            }
            .url {
              font-size: 12px;
              color: #999;
              margin-top: 10px;
              word-break: break-all;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>🍽️ My Restaurant</h1>
            <h2>Table ${table.tableNumber}</h2>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr.qrUrl)}" alt="QR Code" />
            </div>
            <div class="instructions">
              <p><strong>📱 Scan to order!</strong></p>
              <p>1. Open your camera app</p>
              <p>2. Point at this QR code</p>
              <p>3. Tap the notification</p>
              <p>4. Browse menu & order</p>
            </div>
            <div class="url">${qr.qrUrl}</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
          <p className="text-gray-600 mt-1">Generate and print QR codes for table ordering</p>
        </div>
        <button
          onClick={generateAllQRCodes}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          📱 Generate All QR Codes
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📖 How It Works</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>Generate QR codes</strong> for each table</li>
          <li>• <strong>Print and place</strong> QR codes on tables</li>
          <li>• <strong>Customers scan</strong> the code with their phone</li>
          <li>• <strong>Menu opens automatically</strong> with table pre-selected</li>
          <li>• <strong>Orders go directly</strong> to kitchen - no waiter needed!</li>
          <li>• <strong>Payment at cashier</strong> when leaving</li>
        </ul>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => {
          const qr = qrCodes.get(table.id)
          return (
            <div
              key={table.id}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:shadow-lg transition"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">🪑</div>
                <h3 className="text-2xl font-bold text-gray-900">Table {table.tableNumber}</h3>
                <p className="text-sm text-gray-600">{table.capacity} seats</p>
                {table.location && (
                  <p className="text-xs text-gray-500 mt-1">📍 {table.location}</p>
                )}
              </div>

              {qr && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qr.qrUrl)}`}
                      alt={`QR Code for Table ${table.tableNumber}`}
                      className="rounded"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center break-all">{qr.qrUrl}</p>
                </div>
              )}

              <div className="space-y-2">
                {!qr ? (
                  <button
                    onClick={() => generateQRCode(table)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    📱 Generate QR
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => printQRCode(table)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      🖨️ Print QR Code
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qr.qrUrl)}`
                        link.download = `table-${table.tableNumber}-qr.png`
                        link.click()
                      }}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
                    >
                      💾 Download Image
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-4">No tables found</p>
          <p className="text-gray-400">Create tables first to generate QR codes</p>
        </div>
      )}

      {/* Preview Modal */}
      {selectedTable && qrCodes.get(selectedTable.id) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Table {selectedTable.tableNumber} - QR Code
              </h2>
              <div className="mb-6">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrCodes.get(selectedTable.id)!.qrUrl)}`}
                  alt="QR Code"
                  className="mx-auto rounded-lg shadow-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Scan this code to open the menu with Table {selectedTable.tableNumber} pre-selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => printQRCode(selectedTable)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

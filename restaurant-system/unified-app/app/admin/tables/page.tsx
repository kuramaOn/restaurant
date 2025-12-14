'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'

interface Table {
  id: string
  tableNumber: string
  capacity: number
  status: string
}

export default function TablesManagement() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables`, {
        headers: getAuthHeaders(),
      })
      const data = await response.json()
      setTables(data)
    } catch (error) {
      console.error('Failed to fetch tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTableStatus = async (tableId: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${tableId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchTables()
    } catch (error) {
      console.error('Failed to update table:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Manage restaurant tables and seating</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          + Add New Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🪑</div>
              <h3 className="text-xl font-bold text-gray-900">
                Table {table.tableNumber}
              </h3>
              <p className="text-sm text-gray-600">
                Capacity: {table.capacity} people
              </p>
            </div>

            <div className="mb-4">
              <span className={`block text-center px-3 py-2 rounded-lg text-sm font-semibold ${
                table.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                table.status === 'OCCUPIED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {table.status}
              </span>
            </div>

            <div className="space-y-2">
              {table.status !== 'AVAILABLE' && (
                <button
                  onClick={() => updateTableStatus(table.id, 'AVAILABLE')}
                  className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                >
                  Mark Available
                </button>
              )}
              {table.status !== 'OCCUPIED' && (
                <button
                  onClick={() => updateTableStatus(table.id, 'OCCUPIED')}
                  className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                >
                  Mark Occupied
                </button>
              )}
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                Edit Table
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

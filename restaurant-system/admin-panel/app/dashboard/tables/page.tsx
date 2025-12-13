'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'

interface Table {
  id: string
  tableNumber: string
  capacity: number
  status: string
  floorSection: string | null
  currentOrderId: string | null
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    floorSection: '',
    status: 'AVAILABLE'
  })

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables`, {
        headers: getAuthHeaders()
      })
      
      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login')
        window.location.href = '/login'
        return
      }

      if (response.ok) {
        const data = await response.json()
        setTables(data)
      } else {
        throw new Error('Failed to fetch tables')
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingTable
        ? `${process.env.NEXT_PUBLIC_API_URL}/tables/${editingTable.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tables`
      
      const method = editingTable ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          tableNumber: formData.tableNumber,
          capacity: parseInt(formData.capacity),
          floorSection: formData.floorSection || null,
          status: formData.status
        })
      })

      if (response.ok) {
        await fetchTables()
        setShowAddModal(false)
        setEditingTable(null)
        setFormData({ tableNumber: '', capacity: '', location: '', status: 'AVAILABLE' })
      }
    } catch (error) {
      console.error('Error saving table:', error)
    }
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
      floorSection: table.floorSection || '',
      status: table.status
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (response.ok) {
        await fetchTables()
      }
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800'
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CLEANING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Tables Management</h1>
          <p className="text-gray-600 mt-1">Manage restaurant tables and seating</p>
        </div>
        <button
          onClick={() => {
            setEditingTable(null)
            setFormData({ tableNumber: '', capacity: '', floorSection: '', status: 'AVAILABLE' })
            setShowAddModal(true)
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          ➕ Add Table
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🪑</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Table {table.tableNumber}</h3>
                  <p className="text-sm text-gray-600">{table.capacity} seats</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(table.status)}`}>
                {table.status}
              </div>
              {table.floorSection && (
                <p className="text-sm text-gray-600">📍 {table.floorSection}</p>
              )}
              {table.currentOrderId && (
                <p className="text-sm text-blue-600">🍽️ Active Order</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(table)}
                className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(table.id)}
                className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tables found. Add your first table to get started!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingTable ? 'Edit Table' : 'Add New Table'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number *
                </label>
                <input
                  type="number"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (Seats) *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor Section
                </label>
                <input
                  type="text"
                  value={formData.floorSection}
                  onChange={(e) => setFormData({ ...formData, floorSection: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Hall, Window Side, Patio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CLEANING">Cleaning</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTable(null)
                    setFormData({ tableNumber: '', capacity: '', floorSection: '', status: 'AVAILABLE' })
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingTable ? 'Update' : 'Create'} Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

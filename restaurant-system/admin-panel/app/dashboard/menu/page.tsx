'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaders } from '@/lib/auth'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    preparationTime: '15',
    imageUrl: '',
    spiceLevel: '0',
    calories: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders()
      const [itemsRes, catsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items`, {
          headers: { ...headers, 'Content-Type': 'application/json' },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/categories`, {
          headers: { ...headers, 'Content-Type': 'application/json' },
        }),
      ])

      const items = await itemsRes.json()
      const cats = await catsRes.json()

      setMenuItems(items.data || items)
      setCategories(cats.data || cats)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const headers = getAuthHeaders()

    try {
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_URL}/menu/items/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/menu/items`

      const method = editingItem ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime),
          spiceLevel: parseInt(formData.spiceLevel),
          calories: formData.calories ? parseInt(formData.calories) : null,
        }),
      })

      if (response.ok) {
        await fetchData()
        setShowForm(false)
        setEditingItem(null)
        setFormData({
          name: '',
          description: '',
          categoryId: '',
          price: '',
          preparationTime: '15',
          imageUrl: '',
          spiceLevel: '0',
          calories: '',
        })
      }
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId || '',
      price: item.price.toString(),
      preparationTime: item.preparationTime.toString(),
      imageUrl: item.imageUrl || '',
      spiceLevel: (item.spiceLevel || 0).toString(),
      calories: item.calories?.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    const headers = getAuthHeaders()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items/${id}`, {
        method: 'DELETE',
        headers,
      })
      await fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const headers = getAuthHeaders()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items/${id}/availability`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      })
      await fetchData()
    } catch (error) {
      console.error('Error toggling availability:', error)
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Items</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingItem(null)
            setFormData({
              name: '',
              description: '',
              categoryId: '',
              price: '',
              preparationTime: '15',
              imageUrl: '',
              spiceLevel: '0',
              calories: '',
            })
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Add Menu Item
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item: any) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            {item.imageUrl && (
              <div className="relative h-48 bg-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Unavailable</span>
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <span className="text-lg font-bold text-blue-600">${item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {item.category?.name || 'No category'}
                </span>
                {item.spiceLevel > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    🔥 {item.spiceLevel}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(item.id, item.isAvailable)}
                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition ${
                    item.isAvailable
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No menu items yet. Click "Add Menu Item" to get started.
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
}

interface Props {
  item: MenuItem
  onClose: () => void
  onAdd: (item: MenuItem & { notes?: string }) => void
}

export default function ItemCustomizationModal({ item, onClose, onAdd }: Props) {
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAdd({ ...item, notes })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">{item.description}</p>
          <p className="text-2xl font-bold text-green-600 mb-6">${item.price.toFixed(2)}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., No onions, extra spicy..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Add to Cart - ${(item.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

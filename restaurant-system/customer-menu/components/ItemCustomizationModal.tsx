'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category?: { name: string }
  preparationTime?: number
  spiceLevel?: number
  calories?: number
  dietaryTags?: string
}

interface AddOn {
  id: string
  name: string
  price: number
  category: string
}

interface CustomizationModalProps {
  item: MenuItem
  isOpen: boolean
  onClose: () => void
}

// Pre-defined add-ons for different food types
const ADD_ONS: Record<string, AddOn[]> = {
  'Burgers & Sandwiches': [
    { id: 'addon-1', name: 'Extra Cheese', price: 1.50, category: 'toppings' },
    { id: 'addon-2', name: 'Bacon', price: 2.00, category: 'toppings' },
    { id: 'addon-3', name: 'Avocado', price: 2.50, category: 'toppings' },
    { id: 'addon-4', name: 'Fried Egg', price: 1.50, category: 'toppings' },
    { id: 'addon-5', name: 'Grilled Onions', price: 1.00, category: 'toppings' },
    { id: 'addon-6', name: 'Jalapeos', price: 1.00, category: 'toppings' },
  ],
  'Pizza': [
    { id: 'addon-7', name: 'Extra Cheese', price: 2.00, category: 'toppings' },
    { id: 'addon-8', name: 'Pepperoni', price: 2.50, category: 'toppings' },
    { id: 'addon-9', name: 'Mushrooms', price: 1.50, category: 'toppings' },
    { id: 'addon-10', name: 'Olives', price: 1.50, category: 'toppings' },
    { id: 'addon-11', name: 'Bell Peppers', price: 1.50, category: 'toppings' },
    { id: 'addon-12', name: 'Italian Sausage', price: 2.50, category: 'toppings' },
  ],
  'Pasta': [
    { id: 'addon-13', name: 'Grilled Chicken', price: 3.00, category: 'protein' },
    { id: 'addon-14', name: 'Shrimp', price: 4.00, category: 'protein' },
    { id: 'addon-15', name: 'Extra Parmesan', price: 1.50, category: 'toppings' },
    { id: 'addon-16', name: 'Garlic Bread', price: 2.50, category: 'sides' },
  ],
  'Salads': [
    { id: 'addon-17', name: 'Grilled Chicken', price: 3.00, category: 'protein' },
    { id: 'addon-18', name: 'Grilled Salmon', price: 5.00, category: 'protein' },
    { id: 'addon-19', name: 'Avocado', price: 2.50, category: 'toppings' },
    { id: 'addon-20', name: 'Feta Cheese', price: 2.00, category: 'toppings' },
    { id: 'addon-21', name: 'Boiled Egg', price: 1.50, category: 'toppings' },
  ],
  'Default': [
    { id: 'addon-22', name: 'Extra Sauce', price: 0.50, category: 'condiments' },
    { id: 'addon-23', name: 'Side Salad', price: 3.00, category: 'sides' },
    { id: 'addon-24', name: 'French Fries', price: 3.50, category: 'sides' },
    { id: 'addon-25', name: 'Coleslaw', price: 2.50, category: 'sides' },
  ]
}

const SIZES = [
  { id: 'small', name: 'Small', priceMultiplier: 0.8 },
  { id: 'medium', name: 'Medium', priceMultiplier: 1.0 },
  { id: 'large', name: 'Large', priceMultiplier: 1.3 },
]

const SPICE_LEVELS = [
  { id: 'none', name: 'No Spice', icon: '' },
  { id: 'mild', name: 'Mild', icon: '' },
  { id: 'medium', name: 'Medium', icon: '' },
  { id: 'hot', name: 'Hot', icon: '' },
  { id: 'extra-hot', name: 'Extra Hot', icon: '' },
]

export default function ItemCustomizationModal({ item, isOpen, onClose }: CustomizationModalProps) {
  const addItem = useCartStore((state) => state.addItem)
  
  const [selectedSize, setSelectedSize] = useState('medium')
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState('none')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [modifications, setModifications] = useState<string[]>([])

  // Get relevant add-ons based on category
  const categoryAddOns = item.category?.name 
    ? ADD_ONS[item.category.name] || ADD_ONS['Default']
    : ADD_ONS['Default']

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('medium')
      setSelectedSpiceLevel(item.spiceLevel ? 'medium' : 'none')
      setSelectedAddOns([])
      setQuantity(1)
      setSpecialInstructions('')
      setModifications([])
    }
  }, [isOpen, item])

  const calculateTotalPrice = () => {
    const sizeInfo = SIZES.find(s => s.id === selectedSize)
    const basePrice = item.price * (sizeInfo?.priceMultiplier || 1)
    
    const addOnsPrice = selectedAddOns.reduce((total, addonId) => {
      const addon = categoryAddOns.find(a => a.id === addonId)
      return total + (addon?.price || 0)
    }, 0)
    
    return (basePrice + addOnsPrice) * quantity
  }

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const toggleModification = (mod: string) => {
    setModifications(prev =>
      prev.includes(mod)
        ? prev.filter(m => m !== mod)
        : [...prev, mod]
    )
  }

  const handleAddToCart = () => {
    const sizeInfo = SIZES.find(s => s.id === selectedSize)
    const selectedAddOnsData = selectedAddOns
      .map(id => categoryAddOns.find(a => a.id === id))
      .filter((addOn): addOn is AddOn => addOn !== undefined)

    const customizations = {
      size: selectedSize,
      sizeMultiplier: sizeInfo?.priceMultiplier,
      spiceLevel: selectedSpiceLevel,
      addOns: selectedAddOnsData,
      modifications,
      specialInstructions: specialInstructions || undefined
    }

    const totalPrice = calculateTotalPrice()

    // Add each quantity as separate operation to handle customizations properly
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${item.id}-${Date.now()}-${i}`,
        name: item.name,
        price: totalPrice / quantity,
        imageUrl: item.imageUrl,
        customizations,
        specialInstructions
      })
    }

    onClose()
  }

  if (!isOpen) return null

  const COMMON_MODIFICATIONS = [
    'No Onions',
    'No Tomatoes',
    'No Lettuce',
    'No Pickles',
    'Extra Sauce',
    'Less Salt',
    'Well Done',
    'Light Oil',
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative">
          {item.imageUrl && (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-3">{item.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {item.preparationTime && (
                <span className="flex items-center gap-1">
                   {item.preparationTime} mins
                </span>
              )}
              {item.calories && (
                <span className="flex items-center gap-1">
                   {item.calories} cal
                </span>
              )}
              {item.dietaryTags && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {item.dietaryTags}
                </span>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`p-4 border-2 rounded-lg transition ${
                    selectedSize === size.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{size.name}</div>
                  <div className="text-sm text-gray-600">
                    ${(item.price * size.priceMultiplier).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level (if applicable) */}
          {item.spiceLevel !== null && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Spice Level</h3>
              <div className="grid grid-cols-5 gap-2">
                {SPICE_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedSpiceLevel(level.id)}
                    className={`p-3 border-2 rounded-lg transition text-center ${
                      selectedSpiceLevel === level.id
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{level.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{level.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Add-ons (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              {categoryAddOns.map(addon => (
                <button
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  className={`p-4 border-2 rounded-lg transition text-left ${
                    selectedAddOns.includes(addon.id)
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{addon.name}</div>
                      <div className="text-sm text-gray-600">+${addon.price.toFixed(2)}</div>
                    </div>
                    {selectedAddOns.includes(addon.id) && (
                      <span className="text-green-600 text-xl"></span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Modifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Modifications</h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_MODIFICATIONS.map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModification(mod)}
                  className={`px-4 py-2 border-2 rounded-full transition text-sm ${
                    modifications.includes(mod)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests? (e.g., allergies, preferences)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
                >
                  
                </button>
                <span className="text-xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center gap-2"
            >
              Add to Cart - ${calculateTotalPrice().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

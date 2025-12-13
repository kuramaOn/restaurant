'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import ItemCustomizationModal from '@/components/ItemCustomizationModal'
import PullToRefresh from '@/components/PullToRefresh'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableInfo, setTableInfo] = useState<{ tableId: string; tableNumber: number } | null>(null)
  
  const { addItem, getTotalItems } = useCartStore()
  const cartItemCount = getTotalItems()

  // Detect table from URL (QR code scan)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tableId = params.get('table')
      const tableNumber = params.get('tableNumber')
      
      if (tableId && tableNumber) {
        const info = { tableId, tableNumber: parseInt(tableNumber) }
        setTableInfo(info)
        // Save to localStorage for persistence
        localStorage.setItem('tableInfo', JSON.stringify(info))
      } else {
        // Try to load from localStorage
        const saved = localStorage.getItem('tableInfo')
        if (saved) {
          setTableInfo(JSON.parse(saved))
        }
      }
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/items`)
      ])

      const categoriesData = await categoriesRes.json()
      const itemsData = await itemsRes.json()

      setCategories(categoriesData.data || categoriesData)
      setMenuItems(itemsData.data || itemsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleQuickAdd = (item: any) => {
    // Quick add without customization
    addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      imageUrl: item.imageUrl,
    })
  }

  const filteredItems = selectedCategory
    ? menuItems.filter((item: any) => item.categoryId === selectedCategory)
    : menuItems

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={fetchData}>
      <main className="min-h-screen bg-gray-50 pb-4">
        {/* Header - Mobile Optimized */}
        <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">🍽️ My Restaurant</h1>
                  <p className="text-xs sm:text-sm text-green-100 hidden sm:block">Order delicious food online</p>
                </div>
                {tableInfo && (
                  <div className="bg-white/20 backdrop-blur text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-sm">
                    Table {tableInfo.tableNumber}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {tableInfo && (
                  <button
                    onClick={() => alert('Waiter has been notified! They will be with you shortly.')}
                    className="bg-yellow-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-600 active:bg-yellow-700 transition font-medium text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Call Waiter"
                  >
                    <span className="hidden sm:inline">Call Waiter</span>
                    <span className="sm:hidden text-xl">🔔</span>
                  </button>
                )}
                {/* Cart button only visible on desktop */}
                <Link 
                  href="/cart"
                  className="hidden md:flex bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition relative font-semibold"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Categories - Horizontal Scroll on Mobile */}
        <section className="bg-white border-b shadow-sm sticky top-[60px] sm:top-[68px] z-10">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition font-medium text-sm sm:text-base min-h-[44px] snap-start ${
                  selectedCategory === null 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                All Items
            </button>
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition font-medium text-sm sm:text-base min-h-[44px] snap-start ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
      </section>

        {/* Menu Items Grid - Mobile Optimized */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredItems.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow active:scale-98"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 bg-gray-200">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {item.isFeatured && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                      ⭐ Featured
                    </span>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 flex-1">
                      {item.name}
                    </h3>
                    <span className="text-lg sm:text-xl font-bold text-green-600 ml-2">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
                    {item.dietaryTags && JSON.parse(item.dietaryTags || '[]').includes('vegetarian') && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        🌱 Veg
                      </span>
                    )}
                    {item.spiceLevel > 0 && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                        🌶️ {item.spiceLevel}
                      </span>
                    )}
                    {item.calories && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                        {item.calories} cal
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button - Touch Friendly */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 sm:py-3.5 rounded-xl hover:from-green-700 hover:to-teal-700 active:scale-95 transition-all disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed font-semibold text-sm sm:text-base min-h-[44px] shadow-md disabled:shadow-none"
                  >
                    {item.isAvailable ? '🛒 Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 sm:py-16">
              <div className="text-6xl sm:text-8xl mb-4">🍽️</div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                {selectedCategory ? 'No items in this category' : 'No menu items available'}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 text-green-600 hover:text-green-700 font-semibold underline"
                >
                  View all items
                </button>
              )}
            </div>
          )}
        </section>

        {/* Footer - Mobile Hidden (bottom nav instead) */}
        <footer className="bg-white border-t mt-8 sm:mt-12 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600 text-sm">
              <p>&copy; 2024 My Restaurant. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <Link href="/about" className="hover:text-green-600 transition">About</Link>
                <Link href="/contact" className="hover:text-green-600 transition">Contact</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Customization Modal */}
        {selectedItem && (
          <ItemCustomizationModal
            item={selectedItem}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedItem(null)
            }}
          />
        )}
      </main>
    </PullToRefresh>
  )
}

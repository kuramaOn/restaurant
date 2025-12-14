'use client'

interface Props {
  onClick: () => void
  icon: string
  label?: string
  badge?: number
}

export default function FloatingActionButton({ onClick, icon, label, badge }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 z-40"
    >
      <div className="relative p-4">
        <span className="text-2xl">{icon}</span>
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      {label && (
        <div className="px-4 pb-2 text-sm font-semibold">
          {label}
        </div>
      )}
    </button>
  )
}

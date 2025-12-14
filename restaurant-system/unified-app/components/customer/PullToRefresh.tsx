'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export default function PullToRefresh({ onRefresh, children }: Props) {
  const [pulling, setPulling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pullDistance = useRef(0)

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (startY.current === 0) return
    
    const currentY = e.touches[0].clientY
    pullDistance.current = currentY - startY.current

    if (pullDistance.current > 0 && window.scrollY === 0) {
      setPulling(true)
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance.current > 80 && !refreshing) {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }
    
    setPulling(false)
    startY.current = 0
    pullDistance.current = 0
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [refreshing])

  return (
    <div className="relative">
      {(pulling || refreshing) && (
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-4">
          <div className={`${refreshing ? 'animate-spin' : ''}`}>
            🔄
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

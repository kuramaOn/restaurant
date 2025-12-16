'use client'

import { useRef, useState, TouchEvent } from 'react'

interface SwipeableOrderCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: { label: string; color: string; icon: string }
  rightAction?: { label: string; color: string; icon: string }
}

export default function SwipeableOrderCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction
}: SwipeableOrderCardProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50 // Minimum distance for a swipe
  const maxSwipeDistance = 150 // Maximum visual swipe distance

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX
    const distance = currentTouch - touchStart
    
    // Limit the swipe distance
    const limitedDistance = Math.max(
      -maxSwipeDistance,
      Math.min(maxSwipeDistance, distance)
    )
    
    setTranslateX(limitedDistance)
    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)
    const distance = touchEnd - touchStart
    const isLeftSwipe = distance < -minSwipeDistance
    const isRightSwipe = distance > minSwipeDistance

    if (isLeftSwipe && onSwipeLeft) {
      // Animate out then trigger action
      setTranslateX(-maxSwipeDistance * 2)
      setTimeout(() => {
        onSwipeLeft()
        setTranslateX(0)
      }, 300)
    } else if (isRightSwipe && onSwipeRight) {
      // Animate out then trigger action
      setTranslateX(maxSwipeDistance * 2)
      setTimeout(() => {
        onSwipeRight()
        setTranslateX(0)
      }, 300)
    } else {
      // Reset position
      setTranslateX(0)
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      {leftAction && (
        <div 
          className={`absolute inset-y-0 left-0 flex items-center justify-start pl-6 ${leftAction.color} w-full transition-opacity`}
          style={{ opacity: translateX < -minSwipeDistance ? 1 : 0 }}
        >
          <div className="text-white font-semibold flex items-center gap-2">
            <span className="text-2xl">{leftAction.icon}</span>
            <span>{leftAction.label}</span>
          </div>
        </div>
      )}
      
      {rightAction && (
        <div 
          className={`absolute inset-y-0 right-0 flex items-center justify-end pr-6 ${rightAction.color} w-full transition-opacity`}
          style={{ opacity: translateX > minSwipeDistance ? 1 : 0 }}
        >
          <div className="text-white font-semibold flex items-center gap-2">
            <span>{rightAction.label}</span>
            <span className="text-2xl">{rightAction.icon}</span>
          </div>
        </div>
      )}

      {/* Swipeable Card */}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
        className="relative bg-white touch-pan-y"
      >
        {children}
      </div>
    </div>
  )
}

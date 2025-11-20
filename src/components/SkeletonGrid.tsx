'use client'
import React from 'react'
import { SkeletonItem } from './SkeletonItem'

type Variant = 'card' | 'list' | 'tableRow' | 'feedbackLists' | "post" | "programs" | "adminPrograms" | "eda" | "evalLists" | "member"

interface SkeletonGridProps {
  count?: number
  variant?: Variant
  className?: string // extra classes for the grid container
}

/**
 * Renders a grid container (default classes from user) and repeats SkeletonItem
 */
export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  variant = 'card',
  className = '',
}) => {
  const items = Array.from({ length: count }).map((_, i) => (
    <SkeletonItem key={i} variant={variant} />
  ))

  const baseContainerClass =
    variant === 'feedbackLists' || variant === 'post'
    ? 'flex flex-col gap-6 mt-4'
    : variant === 'eda' 
    ? 'flex flex-col gap-6 mt-4'
    : variant === 'evalLists'
    ? 'flex flex-wrap gap-4 mt-4'
    : variant === 'member'
    ? 'w-full mt-6'
    : variant === 'adminPrograms' 
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6' 
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'

  return (
    <div
      className={`${baseContainerClass} ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {items}
    </div>
  )
}

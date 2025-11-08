'use client'
import React from 'react'

type Variant = 'card' | 'list' | 'tableRow' | 'feedbackLists'

interface SkeletonItemProps {
  variant?: Variant
}

export const SkeletonItem: React.FC<SkeletonItemProps> = ({ variant = 'card' }) => {
  if (variant === 'list') {
    return (
      <div className="p-4 rounded-lg border border-transparent bg-white/5 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300/60" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 rounded bg-gray-300/60 w-3/5" />
            <div className="h-2 rounded bg-gray-300/60 w-1/2" />
          </div>
          <div className="w-6 h-6 rounded bg-gray-300/60" />
        </div>
      </div>
    )
  }

  if(variant === 'feedbackLists') {
    return (
      <div className="w-full rounded-md p-4 bg-gray-300/30 dark:bg-gray-700/30 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 w-1/4 rounded bg-gray-400/60" /> {/* name */}
            <div className="h-3 w-1/3 rounded bg-gray-400/50" /> {/* program + role */}
          </div>
          <div className="h-3 w-20 rounded bg-gray-400/50" /> {/* date */}
        </div>
      </div>
    )
  }

  if (variant === 'tableRow') {
    return (
      <div className="w-full p-4 rounded-lg border border-transparent bg-white/5 shadow-sm animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded bg-gray-300/60 w-1/3" />
            {/* <div className="h-2 rounded bg-gray-300/60 w-1/4" /> */}
          </div>
          <div className="w-20 h-4 rounded bg-gray-300/60" />
        </div>
      </div>
    )
  }

  // default: card
  return (
    <div className=" rounded-lg border border-transparent bg-white/5 shadow-sm animate-pulse">
      <div className="w-full h-25 rounded-md bg-gray-300/60 mb-2" />
      {/* <div className="h-4 rounded bg-gray-300/60 w-3/4 mb-2" />  */}
      {/* <div className="h-3 rounded bg-gray-300/60 w-1/2" /> */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-3/4 rounded bg-gray-300/60" />
        <div className="h-8 w-8 rounded-full bg-gray-300/60" />
      </div>
    </div>
  )
}

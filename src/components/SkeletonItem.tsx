'use client'
import React from 'react'

type Variant = 'card' | 'list' | 'tableRow' | 'feedbackLists' | "post" | "programs" | "adminPrograms" | "eda" | "evalLists" | "member"

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

  if (variant === 'feedbackLists') {
    return (
      <div className="w-full rounded-md p-3 bg-gray-300/30 dark:bg-gray-700/30 animate-pulse">
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

  if (variant === 'post') {
    return (
      <div className="w-full space-y-6">

        {/* TASK SKELETON */}
        <div className="w-full p-5 rounded-xl bg-gray-300/20 dark:bg-gray-700/20 shadow animate-pulse">
          {/* title */}
          <div className="h-5 w-2/3 bg-gray-400/60 rounded"></div>

          {/* deadline */}
          <div className="mt-2 h-4 w-1/3 bg-gray-400/40 rounded"></div>

          {/* divider */}
          <div className="my-4 h-[1px] bg-gray-400/30 w-full"></div>

          {/* Add comment button */}
          <div className="h-9 w-32 bg-gray-400/40 rounded-full"></div>
        </div>

        {/* ANNOUNCEMENT SKELETON */}
        <div className="w-full p-5 rounded-xl bg-gray-300/20 dark:bg-gray-700/20 shadow animate-pulse">

          {/* Header - Avatar + Name + Date */}
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-400/40"></div>

            {/* Name + date */}
            <div className="flex-1">
              <div className="h-4 w-1/3 bg-gray-400/60 rounded mb-2"></div>
              <div className="h-3 w-1/4 bg-gray-400/40 rounded"></div>
            </div>

            {/* More options */}
            <div className="w-6 h-6 rounded bg-gray-400/40"></div>
          </div>

          {/* Announcement content */}
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full bg-gray-400/40 rounded"></div>
            <div className="h-3 w-5/6 bg-gray-400/40 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-400/40 rounded"></div>
          </div>

          {/* File section */}
          <div className="mt-4 h-10 bg-gray-400/30 rounded-md"></div>

          {/* View comments button */}
          <div className="mt-4 h-9 w-40 bg-gray-400/40 rounded-full"></div>
        </div>

      </div>
    );
  }

  if (variant === 'adminPrograms') {
    return (
      <div className="w-full p-5 rounded-xl bg-gray-300/20 dark:bg-gray-700/20 shadow animate-pulse">

        {/* Title + Icons */}
        <div className="flex items-start justify-between">
          <div className="h-5 w-1/3 bg-gray-400/60 rounded"></div>

          <div className="flex gap-3">
            <div className="w-5 h-5 bg-gray-400/50 rounded"></div>
            <div className="w-5 h-5 bg-gray-400/50 rounded"></div>
          </div>
        </div>

        {/* Info lines */}
        <div className="mt-3 space-y-2">
          <div className="h-3 w-1/4 bg-gray-400/40 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-400/40 rounded"></div>
          <div className="h-3 w-1/4 bg-gray-400/40 rounded"></div>
        </div>

        {/* Added on badge */}
        <div className="mt-3 h-6 w-32 bg-gray-400/30 rounded-full"></div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-32 bg-gray-400/40 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-400/40 rounded-lg"></div>
        </div>
      </div>
    );
  }


  if (variant === 'programs') {
    return (
      <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm animate-pulse">
        <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-2 ml-auto"></div>
        {/* Program title */}
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>

        {/* A, X total members */}
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>

        {/* Join/Cancel request button */}
        <div className='flex justify-center items-center'>
          <div className="h-9 w-50 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (variant === 'eda') {
    return (
      <div className="w-full space-y-4 animate-pulse">

        {/* Title */}
        <div className="h-5 w-64 bg-gray-400/40 rounded"></div>

        {/* Total Respondents Card */}
        <div className="bg-gray-300/20 dark:bg-gray-700/20 p-6 rounded-xl border border-gray-400/20">
          <div className="h-4 w-40 bg-gray-400/40 rounded mb-4"></div>
          <div className="h-10 w-10 bg-gray-400/60 rounded"></div>
        </div>

        {/* Graph Container */}
        <div className="bg-gray-300/20 dark:bg-gray-700/20 p-6 rounded-xl border border-gray-400/20">

          {/* Graph Title */}
          <div className="h-4 w-72 bg-gray-400/40 rounded mb-6"></div>

          {/* Graph Bars */}
          <div className="flex items-end gap-4 h-[250px]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gray-400/50 rounded"
                style={{ height: `${50 + Math.random() * 120}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'evalLists') {
    return (
      <div className="px-6 py-3 rounded-md bg-gray-400/20 dark:bg-gray-600/20 animate-pulse">
        {/* small icon */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300/50 rounded"></div>
          <div className="h-4 w-24 bg-gray-300/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === 'member') {
  return (
    <div className="w-full p-6 rounded-lg bg-gray-700/30 border border-gray-600 animate-pulse">

      {/* TOP STATS + BUTTONS */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-gray-500/50 rounded-md"></div>
          <div className="h-6 w-28 bg-gray-500/50 rounded-md"></div>
          <div className="h-6 w-32 bg-gray-500/50 rounded-md"></div>
        </div>

        <div className="flex gap-3">
          <div className="h-8 w-20 bg-gray-500/50 rounded-md"></div>
          <div className="h-8 w-24 bg-gray-500/50 rounded-md"></div>
        </div>
      </div>

      {/* INSTRUCTORS */}
      <div className="mb-6">
        <div className="h-5 w-32 bg-gray-500/40 rounded mb-4"></div>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
          <div className="h-4 w-44 bg-gray-500/40 rounded"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
          <div className="h-4 w-40 bg-gray-500/40 rounded"></div>
        </div>
      </div>

      {/* LEARNERS */}
      <div>
        <div className="h-5 w-28 bg-gray-500/40 rounded mb-4"></div>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
          <div className="h-4 w-40 bg-gray-500/40 rounded"></div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
          <div className="h-4 w-36 bg-gray-500/40 rounded"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-500/40"></div>
          <div className="h-4 w-32 bg-gray-500/40 rounded"></div>
        </div>
      </div>
    </div>
  );
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

'use client'

import React, { ChangeEvent, useState, useEffect } from "react"
import { FiSearch } from 'react-icons/fi'
import { useDebouncedValue } from "@/hooks/searchbar/useDebouncedValue"

interface SearchBarProps<T> {
  data: T[]
  onFiltered: (filtered: T[]) => void
  keysToSearch: (keyof T)[]
  placeholder?: string
}

export function SearchBar<T>({
  data,
  onFiltered,
  keysToSearch,
  placeholder
}: SearchBarProps<T>) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      onFiltered(data)
      return
    }

    const filtered = data.filter((item) =>
      keysToSearch.some((key) =>
        String(item[key]).toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    )

    onFiltered(filtered)
  }, [debouncedSearch])

  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}

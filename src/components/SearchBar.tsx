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
    <div  className=" bg-white flex items-center rounded-md px-3 w-64 focus-within:w-96 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out border-b border-transparent hover:border-b-blue-500 focus-within:border-blue-500 ">
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        className="flex-grow bg-transparent py-2 focus:outline-none"
      />
      <FiSearch className="h-5 w-5 text-gray-400 ml-2" />
</div>
  )
}

'use client'

import React, { ChangeEvent, useState, useEffect } from "react"
import { FiSearch } from 'react-icons/fi'
import { useDebouncedValue } from "@/hooks/searchbar/useDebouncedValue"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  delay?: number
}

export function SearchBar({ onSearch, placeholder = "Search...", delay = 300 }: SearchBarProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, delay)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    onSearch(debouncedSearch.trim())
  }, [debouncedSearch, onSearch])

  return (
    <div  className="bg-[#EFEFEF] flex items-center rounded-md px-3 w-64 focus-within:w-96 shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out border-b border-transparent hover:border-b-blue-500 focus-within:border-blue-500 ">
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

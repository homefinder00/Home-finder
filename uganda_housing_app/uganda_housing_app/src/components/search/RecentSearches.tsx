import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, X, TrendUp } from '@phosphor-icons/react'

interface RecentSearch {
  id: string
  query: string
  filters: {
    district?: string
    bedrooms?: string
    minPrice?: number
    maxPrice?: number
  }
  timestamp: string
  resultCount: number
}

interface RecentSearchesProps {
  onSearchSelect: (search: RecentSearch) => void
}

export function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('recent_searches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  const clearAllSearches = () => {
    localStorage.removeItem('recent_searches')
    setRecentSearches([])
  }

  const removeSearch = (id: string) => {
    const updated = recentSearches.filter(search => search.id !== id)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  if (recentSearches.length === 0) {
    return null
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Searches
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearAllSearches}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {recentSearches.slice(0, 5).map((search) => (
            <div key={search.id} className="group relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSearchSelect(search)}
                className="pr-8 hover:bg-primary/10"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {search.query || `${search.filters.district || 'All areas'}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {search.resultCount} results
                  </span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  removeSearch(search.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to save search
export const saveRecentSearch = (searchData: Omit<RecentSearch, 'id' | 'timestamp'>) => {
  const stored = localStorage.getItem('recent_searches')
  const existing = stored ? JSON.parse(stored) : []
  
  const newSearch: RecentSearch = {
    ...searchData,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  }
  
  // Avoid duplicates and keep only last 10
  const filtered = existing.filter((search: RecentSearch) => 
    JSON.stringify(search.filters) !== JSON.stringify(newSearch.filters) ||
    search.query !== newSearch.query
  )
  
  const updated = [newSearch, ...filtered].slice(0, 10)
  localStorage.setItem('recent_searches', JSON.stringify(updated))
}

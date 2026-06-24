import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Search, Loader2 } from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'

export interface ItemData {
  id: number
  name: string
  category: string
  cost: number
  description: string
  sprite: string
}

export const ItemsDirectory: React.FC = () => {
  const { showItemsDirectory, setShowItemsDirectory, darkMode } = usePokedexStore()
  const [items, setItems] = useState<ItemData[]>([])
  const [filteredItems, setFilteredItems] = useState<ItemData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (!showItemsDirectory) return
    const fetchItems = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/items')
        if (res.ok) {
          const data = await res.json()
          setItems(data)
          setFilteredItems(data)
        }
      } catch (err) {
        console.error('Failed to fetch items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [showItemsDirectory])

  useEffect(() => {
    let result = [...items]
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
      )
    }
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory)
    }
    setFilteredItems(result)
  }, [searchTerm, selectedCategory, items])

  if (!showItemsDirectory) return null

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category)))]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-blue-200 bg-white'}`}>
        <CardHeader className={`pb-4 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-50 to-indigo-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Kanto Items Directory</CardTitle>
              <CardDescription className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Browse balls, recovery potions, and evolution stones with descriptions and store pricing
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowItemsDirectory(false)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-200/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:border-blue-500 transition-all ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                }`}
              />
            </div>
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-3 py-2 border rounded-md text-sm capitalize ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-205'
              }`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="h-60 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
              No items found matching your criteria.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                    darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-200 shadow-sm animate-in fade-in zoom-in-95'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        {item.sprite ? (
                          <img src={item.sprite} alt={item.name} className="w-10 h-10 object-contain bg-gray-100 dark:bg-gray-800 rounded p-1" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-400">🎒</div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm capitalize">{item.name}</h4>
                          <span className="text-xxs text-gray-400 capitalize block">{item.category.replace(/-/g, ' ')}</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 font-bold whitespace-nowrap" variant="outline">
                        ₽ {item.cost.toLocaleString()}
                      </Badge>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

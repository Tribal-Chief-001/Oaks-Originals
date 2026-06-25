'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldAlert, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Next.js Page Error caught:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-lg text-red-500">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-extrabold tracking-tight">System Error Detected</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Oak's Pokédex encountered a runtime exception. This issue has been logged, and we are working to resolve it.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        className="bg-red-650 hover:bg-red-600 text-white font-bold flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset System Interface
      </Button>
    </div>
  )
}

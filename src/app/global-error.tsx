'use client'

import { ShieldAlert, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white min-h-screen flex items-center justify-center font-sans antialiased">
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-lg text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">Fatal System Crash</h2>
            <p className="text-sm text-zinc-400">
              A fatal error occurred in the Pokédex core loop. The interface failed to initialize.
            </p>
          </div>
          <Button
            onClick={() => reset()}
            className="w-full bg-red-650 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 py-2.5 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Core Engine
          </Button>
        </div>
      </body>
    </html>
  )
}

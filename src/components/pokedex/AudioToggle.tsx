import React from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { usePokedexStore } from '@/hooks/usePokedexStore'
import { Button } from '@/components/ui/button'

export const AudioToggle: React.FC = () => {
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume } = usePokedexStore()

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="w-8 h-8 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        title={soundEnabled ? "Mute Cries" : "Unmute Cries"}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-blue-500 animate-bounce" style={{ animationDuration: '2s' }} />
        ) : (
          <VolumeX className="w-4 h-4 text-gray-400" />
        )}
      </Button>
      
      {soundEnabled && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={soundVolume}
          onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
          className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500 transition-all duration-300"
          title="Volume Control"
        />
      )}
    </div>
  )
}

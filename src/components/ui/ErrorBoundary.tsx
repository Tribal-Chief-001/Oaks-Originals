'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ShieldAlert } from 'lucide-react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
  name?: string
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught error in "${this.props.name || 'Component'}":`, error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert variant="destructive" className="my-4 border-red-900/50 bg-red-950/20 text-red-500">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold text-sm">Failed to render {this.props.name || 'Component'}</AlertTitle>
          <AlertDescription className="text-xs text-zinc-400 mt-1">
            This module crashed or failed to render. The remaining application state was preserved.
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

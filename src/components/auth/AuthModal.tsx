'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/hooks/use-toast'
import { Loader2, Github, Mail, Lock, ShieldAlert } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data?.user && data?.session === null) {
        toast({
          title: "Registration successful!",
          description: "Please check your email to confirm registration.",
        })
      } else if (data?.session) {
        toast({
          title: "Registration successful!",
          description: "You have been logged in.",
        })
        onSuccess?.()
        onClose()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during signup.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      })
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        }
      })
      if (error) throw error
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "OAuth error",
        description: err.message || `Failed to log in with ${provider}.`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-md text-white shadow-2xl">
        <DialogHeader className="relative pb-4">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-600/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl" />
          
          <div className="flex justify-center mb-3">
            <div className="relative w-12 h-12 rounded-full border-4 border-gray-800 bg-gradient-to-b from-red-500 to-white flex items-center justify-center shadow-lg animate-pulse">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-800" />
              <div className="w-4 h-4 rounded-full border-2 border-gray-800 bg-white z-10" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center tracking-tight bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent">
            Trainer Portal
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center text-sm">
            Access your cloud-synced Teams, Favorites, and Pokédex Tracker.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 mb-2 rounded bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-start gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/80 p-1 rounded-lg border border-gray-700">
            <TabsTrigger value="login" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all rounded-md">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white transition-all rounded-md">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-300 text-xs font-semibold">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="ash@palette.town"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800/60 border-gray-700 text-white pl-10 focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-300 text-xs font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800/60 border-gray-700 text-white pl-10 focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold transition-all shadow-lg hover:shadow-red-600/30"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Enter Portal
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-gray-300 text-xs font-semibold">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="gary@oak-labs.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800/60 border-gray-700 text-white pl-10 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-gray-300 text-xs font-semibold">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800/60 border-gray-700 text-white pl-10 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all shadow-lg hover:shadow-blue-600/30"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Register Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-900 px-2 text-gray-500">Or connect with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('github')}
            className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 text-white hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Github className="w-4 h-4" /> GitHub
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin('google')}
            className="border-gray-800 bg-gray-800/50 hover:bg-gray-800 text-white hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg> Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const SupabaseAuthContext = createContext({})

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing in with Google:', error.message)
      return { data: null, error: error.message }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error.message)
      return { error: error.message }
    }
  }

  // Get user profile
  const getUserProfile = async () => {
    if (!user) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error.message)
      return null
    }
  }

  // Create or update user profile
  const upsertProfile = async (profileData) => {
    if (!user) return null
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || profileData.full_name,
          avatar_url: user.user_metadata?.avatar_url || profileData.avatar_url,
          updated_at: new Date().toISOString(),
          ...profileData
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating profile:', error.message)
      return null
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
    getUserProfile,
    upsertProfile
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export default SupabaseAuthContext

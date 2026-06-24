import { supabase } from './supabaseClient'

/**
 * Validates a Bearer JWT token from the Authorization header and returns the authenticated Supabase user.
 * Returns null if the token is missing, invalid, or expired.
 */
export async function getAuthUser(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return null
    }

    return user
  } catch (err) {
    console.error('Error validating auth token:', err)
    return null
  }
}

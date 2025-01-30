'use server'
import { createClient } from '@/utils/supabase/server'

const fetchUser = async () => {
    const supabase = await createClient()
    return supabase.auth.getUser()
}

export default fetchUser

'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log(error)
        return error.code
    }

    return 'login_success'
    // setTimeout(() => {
    // redirect('/dashboard')
    // }, 5000)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const firstName = formData.get('first-name') as string
    const lastName = formData.get('last-name') as string
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: `${firstName + ' ' + lastName}`,
                email: formData.get('email') as string
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error)
        return error.code
    }

    // setTimeout(() => {
    redirect('/dashboard')
    // }, 5000)
}

export async function signout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
        return error.code
    }

    redirect('/')
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent'
            },
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm`
        }
    })

    if (error) {
        console.log(error)
        return error.code
    }

    redirect(data.url)
}

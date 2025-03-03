import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const referralCode = searchParams.get('referral_code')

    if (!referralCode) {
        return NextResponse.json({ error: 'Kode referral diperlukan untuk validasi.' }, { status: 400 })
    }

    try {
        const { data, error } = await supabase.from('Referrals').select('*').eq('referral_code', referralCode).single()

        if (error || !data) {
            return NextResponse.json({ error: 'Kode referral tidak valid.' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Terjadi kesalahan saat memvalidasi referral.' }, { status: 500 })
    }
}

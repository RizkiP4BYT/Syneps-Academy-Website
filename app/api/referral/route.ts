import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Referrals').select('*').order('referrer', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data silabus.' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.referrer || !body.referral_code || !body.discount_percentage) {
        return NextResponse.json(
            {
                error: "Diperlukan 'referrer', 'referral_code', dan 'discount_percentage' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Referrals').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat silabus.' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.referral_id || !body.referrer || !body.referral_code || !body.discount_percentage) {
        return NextResponse.json(
            {
                error: "Diperlukan 'referral_id', 'referrer', 'referral_code', dan 'discount_percentage' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Referrals').update(body).eq('referral_id', body.referral_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui silabus.' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { referral_id } = await request.json()

    if (!referral_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'referral_id' untuk penghapusan" }, { status: 400 })
    }
    try {
        const { error } = await supabase.from('Referrals').delete().eq('referral_id', referral_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus silabus' }, { status: 500 })
    }
}

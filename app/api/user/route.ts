import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Users').select('*').order('user_name', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data pengguna' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.user_name || !body.user_level) {
        return NextResponse.json(
            {
                error: "Diperlukan 'user_name' dan 'user_level' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Users').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat pengguna' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.user_id || !body.user_name || !body.user_level) {
        return NextResponse.json(
            {
                error: "Diperlukan 'user_id', 'user_name', dan 'user_level' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Users').update(body).eq('user_id', body.user_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui pengguna' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { user_id } = await request.json()

    if (!user_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'user_id' untuk penghapusan" }, { status: 400 })
    }
    try {
        const { error } = await supabase.from('Users').delete().eq('user_id', user_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 })
    }
}

import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Batch').select('*').order('id', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data batch' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.batch_start || !body.batch_end) {
        return NextResponse.json(
            {
                error: "Diperlukan 'batch_start' dan 'batch_end' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Batch').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat batch' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.id || !body.batch_start || !body.batch_end) {
        return NextResponse.json(
            {
                error: "Diperlukan 'id', 'batch_start', dan 'batch_end' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Batch').update(body).eq('id', body.id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui batch' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'id' untuk penghapusan" }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('Batch').delete().eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus batch' }, { status: 500 })
    }
}

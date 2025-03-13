import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

interface Batches {
    batch_id: string
    batch_name: string
    batch_start: Date | null
    batch_end: Date | null
}

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Batches').select('*').order('batch_name', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data batch' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body: Batches = await request.json()

    if (!body.batch_start || !body.batch_end) {
        return NextResponse.json(
            {
                error: "Diperlukan 'batch_start' dan 'batch_end' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Batches').insert([{
            batch_name: body.batch_name,
            batch_start: body.batch_start,
            batch_end: body.batch_end
        }])

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat batch' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body: Batches = await request.json()

    if (!body.batch_id || !body.batch_name || !body.batch_start || !body.batch_end) {
        return NextResponse.json(
            {
                error: "Diperlukan 'batch_id', 'batch_name', 'batch_start', dan 'batch_end' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Batches').update(body).eq('batch_id', body.batch_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui batch' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { batch_id }: Batches = await request.json()

    if (!batch_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'batch_id' untuk penghapusan" }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('Batches').delete().eq('batch_id', batch_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus batch' }, { status: 500 })
    }
}

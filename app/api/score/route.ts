import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const class_id = new URL(request.url).searchParams.get('class_id')

    try {
        const { data, error } = await supabase.from('Scores').select('*').eq('class_id', class_id).order('user_id', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data program' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.program_name || !body.program_description) {
        return NextResponse.json(
            {
                error: "Diperlukan 'program_name', dan 'program_description' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Programs').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat program' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.program_id || !body.program_name || !body.program_description) {
        return NextResponse.json(
            {
                error: "Diperlukan 'program_id', 'program_name', dan 'program_description' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Programs').update(body).eq('program_id', body.program_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui program' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { program_id } = await request.json()

    if (!program_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'program_id' untuk penghapusan" }, { status: 400 })
    }
    try {
        const { error } = await supabase.from('Programs').delete().eq('program_id', program_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus program' }, { status: 500 })
    }
}

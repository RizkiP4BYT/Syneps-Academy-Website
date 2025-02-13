import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Syllabuses').select('*').order('syllabus_name', { ascending: true })

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

    if (!body.syllabus_name || !body.minimum_criteria) {
        return NextResponse.json(
            {
                error: "Diperlukan 'syllabus_name', dan 'minimum_criteria' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Syllabuses').insert([body]).select()

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

    if (!body.syllabus_id || !body.syllabus_name || !body.minimum_criteria) {
        return NextResponse.json(
            {
                error: "Diperlukan 'syllabus_id', 'syllabus_name', dan 'minimum_criteria' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Syllabuses').update(body).eq('syllabus_id', body.syllabus_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui silabus.' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { syllabus_id } = await request.json()

    if (!syllabus_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'syllabus_id' untuk penghapusan" }, { status: 400 })
    }
    try {
        const { error } = await supabase.from('Syllabuses').delete().eq('syllabus_id', syllabus_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus silabus' }, { status: 500 })
    }
}

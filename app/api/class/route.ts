import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

interface Classes {
    class_id: number
    program_id: number
    batch_id: number
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    is_active: boolean
    syllabuses: [
        {
            syllabus_id: string
            syllabus_name: string
            minimum_criteria: number
        }
    ]
    Programs: {
        program_id: number
        program_name: string
    }
    Batches: {
        batch_id: number
        batch_number: number
        batch_start: string
        batch_end: string
    }
}

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.rpc('get_classes_with_programs_and_batches')
        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data kelas' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body: Classes = await request.json()

    if (!body.program_id || !body.batch_id || !body.class_name || !body.class_description || !body.learning_method || !body.syllabuses || !body.is_active) {
        return NextResponse.json(
            {
                error: "Diperlukan 'program_id', 'batch_id', 'class_name', 'class_description', 'learning_method', 'syllabuses', dan 'is_active' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Classes').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat kelas' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body: Classes = await request.json()

    if (!body.program_id || !body.batch_id || !body.class_name || !body.class_description || !body.learning_method || !body.syllabuses || !body.is_active) {
        return NextResponse.json(
            {
                error: "Diperlukan 'program_id', 'batch_id', 'class_name', 'class_description', 'learning_method', 'syllabuses', 'is_active' untuk melanjutkan.",
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Classes').update(body).eq('class_id', body.class_id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui kelas' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { class_id }: Classes = await request.json()

    if (!class_id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'class_id' untuk penghapusan" }, { status: 400 })
    }

    console.log(class_id)
    try {
        const { error } = await supabase.from('Classes').delete().eq('class_id', class_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus kelas' }, { status: 500 })
    }
}

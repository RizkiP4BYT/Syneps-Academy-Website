import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

interface Scores {
    score: number
    score_id: string
    syllabus_id: string
    class_id: string
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.scores || body.scores.length === 0) {
        return NextResponse.json(
            {
                error: "Diperlukan 'scores' untuk melanjutkan pengisian nilai.",
            },
            { status: 400 }
        )
    }
    const scores: Scores[] = body.scores

    try {
        const { data, error } = await supabase
            .from('Scores')
            .insert(
                scores.map((score) => {
                    score.syllabus_id, score.score, score.class_id
                })
            )
            .select()

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menambahkan nilai' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.scores || body.scores.length === 0) {
        return NextResponse.json(
            {
                error: "Diperlukan 'scores' untuk melanjutkan pengisian nilai.",
            },
            { status: 400 }
        )
    }
    const scores: Scores[] = body.scores

    try {
        const { data, error } = await supabase
            .from('Scores')
            .upsert(
                scores.map((score) => {
                    score.score_id, score.syllabus_id, score.score, score.class_id
                })
            )
            .select()

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
        const { error } = await supabase.from('S').delete().eq('program_id', program_id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus program' }, { status: 500 })
    }
}

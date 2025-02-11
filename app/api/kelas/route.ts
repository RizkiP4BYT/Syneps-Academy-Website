import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.from('Kelas').select('*').order('id', { ascending: true })

        if (error) throw error
        return NextResponse.json(data)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal mengambil data kelas' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.id_program || !body.id_batch || !body.nama_kelas || !body.deskripsi_kelas || !body.metode_pembayaran) {
        return NextResponse.json(
            {
                error: "Diperlukan 'id_program', 'id_batch', 'nama_kelas', 'deskripsi_kelas', dan 'metode_pembayaran' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Kelas').insert([body]).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat kelas' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.id || !body.id_program || !body.id_batch || !body.nama_kelas || !body.deskripsi_kelas || !body.metode_pembayaran) {
        return NextResponse.json(
            {
                error: "Diperlukan 'id', 'id_program', 'id_batch', 'nama_kelas', 'deskripsi_kelas', dan 'metode_pembayaran' untuk melanjutkan."
            },
            { status: 400 }
        )
    }

    try {
        const { data, error } = await supabase.from('Kelas').update(body).eq('id', body.id).select()

        if (error) throw error
        return NextResponse.json(data[0])
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal memperbarui kelas' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const supabase = await createClient()
    const { id } = await request.json()

    if (!id) {
        return NextResponse.json({ error: "Kamu harus memasukkan 'id' untuk penghapusan" }, { status: 400 })
    }

    try {
        const { error } = await supabase.from('Kelas').delete().eq('id', id)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menghapus kelas' }, { status: 500 })
    }
}

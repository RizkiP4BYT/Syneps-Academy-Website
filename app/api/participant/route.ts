import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { class_id, participants } = await request.json()

    if (!class_id || !participants || !Array.isArray(participants)) {
        return NextResponse.json({ error: "Diperlukan 'class_id' dan 'participants' (array) untuk menyimpan data" }, { status: 400 })
    }

    try {
        // Ambil daftar peserta yang sudah ada di database
        const { data: existingParticipants, error: fetchError } = await supabase.from('Participants').select('user_id').eq('class_id', class_id)

        if (fetchError) throw fetchError

        const existingUserIds = existingParticipants.map((p) => p.user_id)
        const newUserIds = participants.map((p) => p.user_id)

        // Hapus peserta yang tidak ada di daftar baru
        const usersToDelete = existingUserIds.filter((id) => !newUserIds.includes(id))
        if (usersToDelete.length > 0) {
            const { error: deleteError } = await supabase.from('Participants').delete().eq('class_id', class_id).in('user_id', usersToDelete)

            if (deleteError) throw deleteError
        }

        // Tambahkan peserta baru
        const usersToAdd = participants.filter((p) => !existingUserIds.includes(p.user_id))
        if (usersToAdd.length > 0) {
            const { error: insertError } = await supabase.from('Participants').insert(usersToAdd.map((user) => ({ class_id, user_id: user.user_id })))

            if (insertError) throw insertError
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal menyimpan peserta' }, { status: 500 })
    }
}

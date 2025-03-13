import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

interface UserRequest {
    class_id: string
    fullName: string
    email: string
    gender: string
    placeOfBirth: string
    birthDate: string
    education: string
    phone: string
    relativePhone: string
    city: string
    address: string
    knownClass: string
    motivation: string
    paymentMethod: string
    referralCode: string
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const body: UserRequest = await request.json()

    if (
        !body.class_id ||
        !body.fullName ||
        !body.email ||
        !body.gender ||
        !body.placeOfBirth ||
        !body.birthDate ||
        !body.education ||
        !body.phone ||
        !body.relativePhone ||
        !body.city ||
        !body.address ||
        !body.knownClass ||
        !body.motivation ||
        !body.paymentMethod
    ) {
        return NextResponse.json(
            {
                error: 'Semua field harus diisi untuk melanjutkan.'
            },
            { status: 400 }
        )
    }

    try {
        const { data: user, error: userError } = await supabase
            .from('Users')
            .insert([
                {
                    user_name: body.fullName,
                    user_level: 'Siswa',
                    email: body.email,
                    gender: body.gender,
                    place_of_birth: body.placeOfBirth,
                    birth_date: new Date(body.birthDate).toISOString(),
                    education: body.education,
                    phone: body.phone,
                    relative_phone: body.relativePhone,
                    domicile: body.city,
                    address: body.address
                }
            ])
            .select()

        if (userError) {
            throw userError
        }

        const { error: participantError } = await supabase.from('Participants').insert([
            {
                class_id: body.class_id,
                user_id: user[0].user_id,
                referral_code: body.referralCode || null
            }
        ])

        if (participantError) {
            throw participantError
        }

        const { error: analyticsError } = await supabase.from('Analytics').insert([
            {
                user_id: user[0].user_id,
                class_id: body.class_id,
                known_class: body.knownClass,
                motivation: body.motivation
            }
        ])

        if (analyticsError) {
            throw analyticsError
        }

        const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
        const discordPayload = {
            content: null,
            embeds: [
                {
                    title: 'Syneps Academy Registration Log',
                    description: 'Berhasil menangkap data registrasi dari website. Berikut informasi pendaftar:',
                    color: 9830195,
                    fields: [
                        { name: 'Nama Lengkap', value: body.fullName },
                        { name: 'Email', value: body.email },
                        { name: 'Jenis Kelamin', value: body.gender },
                        { name: 'Tempat Lahir', value: body.placeOfBirth },
                        { name: 'Tanggal Lahir', value: new Date(body.birthDate).toLocaleDateString() },
                        { name: 'Pendidikan Terakhir', value: body.education },
                        { name: 'Nomor HP', value: body.phone },
                        { name: 'Nomor HP Kerabat', value: body.relativePhone },
                        { name: 'Kota Domisili', value: body.city },
                        { name: 'Alamat Lengkap', value: body.address },
                        { name: 'Mengetahui Kelas Dari', value: body.knownClass },
                        { name: 'Motivasi', value: body.motivation },
                        { name: 'Metode Pembayaran', value: body.paymentMethod },
                        { name: 'Kode Referral', value: body.referralCode || 'Tidak ada' }
                    ],
                    footer: {
                        text: '© Syneps Academy 2025'
                    }
                }
            ],
            attachments: []
        }

        const discordResponse = await fetch(discordWebhookUrl!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discordPayload)
        })

        if (!discordResponse.ok) {
            console.error('Gagal mengirim notifikasi ke Discord')
        }

        return NextResponse.json({ data: 'Success!' }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 })
    }
}

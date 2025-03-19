'use client'

import React, { useEffect, useState } from 'react'
import { Box, Card, CardActionArea, CardContent, Grid2, Stack, Typography, useMediaQuery, useTheme, MenuItem, Autocomplete, Button, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import CustomTextField from '../components/CustomTextField'
import { DatePicker } from '@mui/x-date-pickers'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import dataProvince from '@/lib/types/cityByProvince'
import CustomSnackbar from '../components/CustomSnackbar'

interface Class {
    class_id: string
    program_id: string
    batch_id: string
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    is_active: boolean
}

interface Program {
    program_id: string
    program_name: string
    program_description: string
}

interface Batch {
    batch_id: string
    batch_name: string
    batch_start: Date
    batch_end: Date
}

interface ActiveClass {
    Classes: Class[]
    Programs: Program[]
    Batches: Batch[]
}

const RegistrationPage = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: activeClass = { Classes: [], Programs: [], Batches: [] },
        isLoading,
        isError
    } = useQuery<ActiveClass>({
        queryKey: ['ActiveClass'],
        queryFn: async () => {
            const res = await fetch('/api/active_class')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        }
    })

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')
    const [redirectPage, setRedirectPage] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const [selectedProgram, setSelectedProgram] = useState<string>('')
    const [selectedClass, setSelectedClass] = useState<string>('')
    const [birthDate, setBirthDate] = useState<Date | null>(null)
    const [paymentMethod, setPaymentMethod] = useState<string>('upfront')
    const [fullName, setFullName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [gender, setGender] = useState<string>('')
    const [placeOfBirth, setPlaceOfBirth] = useState<string>('')
    const [education, setEducation] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [relativePhone, setRelativePhone] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [knownClass, setKnownClass] = useState<string>('')
    const [motivation, setMotivation] = useState<string>('')
    const [referralCode, setReferralCode] = useState<string>('')
    const options = dataProvince.flatMap((provinsi) =>
        provinsi.kota.map((kota) => ({
            label: kota,
            group: provinsi.provinsi
        }))
    )

    useEffect(() => {
        if (!activeClass.Programs.length && !isLoading && !isError) {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('Tidak ada program yang tersedia saat ini.')
        }
    }, [activeClass, isLoading, isError])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (referralCode) {
            try {
                const referralResponse = await fetch(`/api/validateReferral?referral_code=${referralCode}`)
                if (!referralResponse.ok) {
                    const referralData = await referralResponse.json()
                    setSnackbarOpen(true)
                    setSnackbarSeverity('error')
                    setSnackbarMessage(referralData.error || 'Kode referral tidak valid')
                    setIsSubmitting(false)
                    return
                }
            } catch (error) {
                console.error('Terjadi kesalahan saat memvalidasi referral:', error)
                setSnackbarOpen(true)
                setSnackbarSeverity('error')
                setSnackbarMessage('Terjadi kesalahan saat memvalidasi referral')
                setIsSubmitting(false)
                return
            }
        }

        const formData = {
            class_id: selectedClass,
            birthDate,
            paymentMethod,
            fullName,
            email,
            gender,
            placeOfBirth,
            education,
            phone,
            relativePhone,
            city,
            address,
            knownClass,
            motivation,
            referralCode
        }

        try {
            const response = await fetch('/api/submit_registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok || response.status !== 200) {
                setSnackbarOpen(true)
                setSnackbarSeverity('error')
                setSnackbarMessage('Gagal mengirim formulir')
            }

            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Pengiriman formulir berhasil!')
            setRedirectPage('/registrationv2/success')
        } catch (error) {
            console.error('Terjadi kesalahan:', error)
        } finally {
            setIsSubmitting(false)
        }
    }
    console.log(activeClass.Classes)
    if (isLoading) {
        return (
            <Box p={isMobile ? 2 : 4}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="h5" component="div">
                            <Skeleton width="60%" />
                        </Typography>
                        <Grid2 container spacing={2}>
                            {[1, 2, 3].map((_, index) => (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">
                                                <Skeleton />
                                            </Typography>
                                            <Typography variant="body1">
                                                <Skeleton />
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="h3" fontWeight={600} component="div">
                            <Skeleton width="50%" />
                        </Typography>
                        <Grid2 container spacing={2}>
                            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                <Grid2 size={{ xs: 12, sm: 6 }} key={index}>
                                    <Skeleton variant="rectangular" height={56} />
                                </Grid2>
                            ))}
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                        <Typography variant="h3" fontWeight={600} component="div">
                            <Skeleton width="50%" />
                        </Typography>
                        <Grid2 container spacing={2}>
                            {[1, 2].map((_, index) => (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">
                                                <Skeleton />
                                            </Typography>
                                            <Typography variant="body1">
                                                <Skeleton />
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12 }}>
                        <Skeleton variant="rectangular" height={48} />
                    </Grid2>
                </Grid2>
            </Box>
        )
    }

    if (isError) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <Box
            sx={{
                position: 'relative',
                '&:before': {
                    content: '""',
                    background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
                    backgroundSize: '400% 400%',
                    animation: 'gradient 1s ease infinite',
                    position: 'absolute',
                    zIndex: '-1',
                    height: '100%',
                    width: '100%',
                    opacity: '0.9'
                }
            }}
        >
            <Grid2 container justifyContent="center" sx={{ height: 'auto' }}>
                <Grid2 size={{ xs: 10, sm: 10, lg: 8, xl: 8 }} display="flex" alignItems="center" flexDirection="column">
                    <Image src="/assets/images/syn-logo-dark.svg" alt="Syneps Academy Logo" width={150} height={150} />
                    <Typography variant="h3" textAlign="center" color="textPrimary">
                        Formulir Pendaftaran Syneps Academy
                    </Typography>
                    <Typography variant="subtitle1" textAlign="center" color="textPrimary" mb={4}>
                        Selamat datang di formulir pendaftaran Syneps Academy! Silahkan untuk mengisi data
                    </Typography>
                    <Card elevation={18} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '700px' }}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <Typography variant="h5" component="label" htmlFor="program">
                                        Program yang ingin diikuti
                                    </Typography>
                                    <Grid2 container spacing={2} justifyContent="center">
                                        {activeClass.Programs.map((program) => (
                                            <Grid2 key={program.program_id} sx={{ xs: 12, sm: 6, md: 4 }}>
                                                <Card sx={{ mb: 2 }}>
                                                    <CardActionArea
                                                        onClick={() => setSelectedProgram(program.program_id)}
                                                        sx={{
                                                            height: '100%',
                                                            backgroundColor: selectedProgram === program.program_id ? theme.palette.action.selected : 'transparent',
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.action.hover
                                                            }
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography variant="h6">{program.program_name}</Typography>
                                                            <Typography variant="body1">{program.program_description}</Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                    <CustomTextField
                                        label="Pilih Kelas"
                                        variant="filled"
                                        fullWidth
                                        name="program"
                                        id="program"
                                        select
                                        required
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        {selectedProgram ? (
                                            activeClass.Classes && activeClass.Classes.filter((c) => c.program_id === selectedProgram).length > 0 ? (
                                                activeClass.Classes.filter((c) => c.program_id === selectedProgram).map((kelas) => (
                                                    <MenuItem key={kelas.class_id} value={kelas.class_id} sx={{ whiteSpace: 'normal' }}>
                                                        {kelas.class_name} - {activeClass.Batches.find((b) => b.batch_id === kelas.batch_id)?.batch_name} (
                                                        {format(activeClass.Batches.find((b) => b.batch_id === kelas.batch_id)!.batch_start, 'dd MMMM yyyy', { locale: id })})
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem key="notfound" disabled>
                                                    Kelas Tidak Tersedia
                                                </MenuItem>
                                            )
                                        ) : (
                                            <MenuItem disabled value="">
                                                Pilih Program Terlebih Dahulu
                                            </MenuItem>
                                        )}
                                    </CustomTextField>
                                    <Grid2 container spacing={2}>
                                        <Typography variant="h3" fontWeight={600} component="label" htmlFor="program">
                                            Informasi Data Diri
                                        </Typography>
                                        <CustomTextField
                                            label="Nama Lengkap Sesuai KTP"
                                            variant="outlined"
                                            fullWidth
                                            name="name"
                                            id="name"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                        <CustomTextField
                                            label="Email"
                                            variant="outlined"
                                            fullWidth
                                            name="email"
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <CustomTextField
                                            label="Jenis Kelamin"
                                            variant="outlined"
                                            fullWidth
                                            name="gender"
                                            id="gender"
                                            select
                                            required
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            <MenuItem value="" disabled>
                                                Pilih Jenis Kelamin
                                            </MenuItem>
                                            <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                                            <MenuItem value="Perempuan">Perempuan</MenuItem>
                                        </CustomTextField>
                                        <Grid2 size={{ xs: 5, sm: 6 }}>
                                            <CustomTextField
                                                label="Tempat Lahir"
                                                variant="outlined"
                                                fullWidth
                                                name="place_of_birth"
                                                id="place_of_birth"
                                                required
                                                value={placeOfBirth}
                                                onChange={(e) => setPlaceOfBirth(e.target.value)}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 7, sm: 6 }}>
                                            <DatePicker
                                                label="Tanggal Lahir"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e!)}
                                                format="dd MMMM yyyy"
                                                slots={{
                                                    textField: CustomTextField
                                                }}
                                                slotProps={{
                                                    textField: { fullWidth: true, required: true }
                                                }}
                                            />
                                        </Grid2>
                                        <CustomTextField
                                            label="Pendidikan Terakhir"
                                            variant="outlined"
                                            fullWidth
                                            name="pendidikan"
                                            id="pendidikan"
                                            select
                                            required
                                            value={education}
                                            onChange={(e) => setEducation(e.target.value)}
                                        >
                                            <MenuItem value="" disabled>
                                                Pendidkan Terakhir
                                            </MenuItem>
                                            <MenuItem value="SD">SD/Sederajat</MenuItem>
                                            <MenuItem value="SMP">SMP/MTs/Sederajat</MenuItem>
                                            <MenuItem value="SMA">SMA/SMK/MA/Sederajat</MenuItem>
                                            <MenuItem value="Diploma">Diploma (D1-D4)</MenuItem>
                                            <MenuItem value="S1">Sarjana (S1)</MenuItem>
                                            <MenuItem value="S2">Magister (S2)</MenuItem>
                                            <MenuItem value="S3">Doktor (S3)</MenuItem>
                                        </CustomTextField>
                                        <Grid2 size={{ xs: 6, sm: 6 }}>
                                            <CustomTextField
                                                label="Nomor HP"
                                                variant="outlined"
                                                fullWidth
                                                name="phone"
                                                id="phone"
                                                type="tel"
                                                required
                                                placeholder="Contoh: 081234567890"
                                                inputProps={{ maxLength: 13 }}
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </Grid2>
                                        <Grid2 size={{ xs: 6, sm: 6 }}>
                                            <CustomTextField
                                                label="Nomor HP Kerabat (Tidak Serumah)"
                                                variant="outlined"
                                                fullWidth
                                                name="phone"
                                                id="phone"
                                                type="tel"
                                                required
                                                placeholder="Contoh: 081234567890"
                                                inputProps={{ maxLength: 13 }}
                                                value={relativePhone}
                                                onChange={(e) => setRelativePhone(e.target.value)}
                                            />
                                        </Grid2>
                                        <Autocomplete
                                            options={options}
                                            groupBy={(option) => option.group}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <CustomTextField {...params} label="Kota Domisili" variant="outlined" />}
                                            fullWidth
                                            onChange={(event, value) => setCity(value?.label || '')}
                                        />
                                        <CustomTextField
                                            label="Alamat Lengkap"
                                            variant="outlined"
                                            fullWidth
                                            name="address"
                                            id="address"
                                            required
                                            multiline
                                            rows={4}
                                            placeholder="Masukkan alamat lengkap"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                        <CustomTextField
                                            label="Darimana Mengetahui Kelas Ini"
                                            variant="outlined"
                                            fullWidth
                                            name="knownClass"
                                            id="knownClass"
                                            select
                                            required
                                            sx={{ mb: 2 }}
                                            value={knownClass}
                                            onChange={(e) => setKnownClass(e.target.value)}
                                        >
                                            <MenuItem value="" disabled>
                                                Darimana Mengetahui Program Ini
                                            </MenuItem>
                                            <MenuItem value="Internet">Internet (Google, Bing, dll)</MenuItem>
                                            <MenuItem value="Sosial Media">Sosial Media (Facebook, Instagram, Twitter, dll)</MenuItem>
                                            <MenuItem value="Teman">Rekomendasi Teman</MenuItem>
                                            <MenuItem value="Keluarga">Rekomendasi Keluarga</MenuItem>
                                            <MenuItem value="Sekolah">Sekolah/Universitas</MenuItem>
                                            <MenuItem value="Majalah">Majalah/Koran</MenuItem>
                                            <MenuItem value="Radio">Radio</MenuItem>
                                            <MenuItem value="TV">TV</MenuItem>
                                            <MenuItem value="Poster">Poster/Iklan</MenuItem>
                                            <MenuItem value="Event">Event/Seminar</MenuItem>
                                            <MenuItem value="Lainnya">Lainnya</MenuItem>
                                        </CustomTextField>
                                        <CustomTextField
                                            label="Motivasi Mengikuti Program Ini"
                                            variant="outlined"
                                            fullWidth
                                            name="motivation"
                                            id="motivation"
                                            select
                                            required
                                            sx={{ mb: 2 }}
                                            value={motivation}
                                            onChange={(e) => setMotivation(e.target.value)}
                                        >
                                            <MenuItem value="" disabled>
                                                Motivasi Mengikuti Program Ini
                                            </MenuItem>
                                            <MenuItem value="pengembangan_diri">Pengembangan Diri</MenuItem>
                                            <MenuItem value="karir">Meningkatkan Karir</MenuItem>
                                            <MenuItem value="pengetahuan_baru">Memperoleh Pengetahuan Baru</MenuItem>
                                            <MenuItem value="jaringan">Membangun Jaringan</MenuItem>
                                            <MenuItem value="kesempatan_kerja">Mencari Kesempatan Kerja</MenuItem>
                                            <MenuItem value="hobi">Mengembangkan Hobi</MenuItem>
                                            <MenuItem value="rekomendasi">Rekomendasi dari Orang Lain</MenuItem>
                                            <MenuItem value="kebutuhan_pekerjaan">Kebutuhan untuk Pekerjaan</MenuItem>
                                            <MenuItem value="keingintahuan">Keingintahuan</MenuItem>
                                            <MenuItem value="lainnya">Lainnya</MenuItem>
                                        </CustomTextField>
                                        <Typography variant="h3" fontWeight={600} component="label" htmlFor="program">
                                            Metode Pembayaran
                                        </Typography>
                                    </Grid2>
                                    <Grid2 container spacing={2} justifyContent="center">
                                        <Grid2 sx={{ xs: 12, sm: 6, md: 4 }}>
                                            <Card sx={{ mb: 2 }}>
                                                <CardActionArea
                                                    onClick={() => setPaymentMethod('upfront')}
                                                    sx={{
                                                        height: '100%',
                                                        backgroundColor: paymentMethod === 'upfront' ? theme.palette.action.selected : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography variant="h6">Upfront</Typography>
                                                        <Typography variant="body1">Pelunasan di awal</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid2>
                                        <Grid2 sx={{ xs: 12, sm: 6, md: 4 }}>
                                            <Card sx={{ mb: 2 }}>
                                                <CardActionArea
                                                    onClick={() => setPaymentMethod('cicilan')}
                                                    sx={{
                                                        height: '100%',
                                                        backgroundColor: paymentMethod === 'cicilan' ? theme.palette.action.selected : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover
                                                        }
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Typography variant="h6">Cicilan 0%</Typography>
                                                        <Typography variant="body1">Cicilan tanpa bunga</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid2>
                                    </Grid2>
                                    <CustomTextField
                                        label="Kode Referral (Jika Ada)"
                                        variant="outlined"
                                        fullWidth
                                        name="referral"
                                        id="referral"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                    />
                                    <Button color="primary" variant="contained" size="large" fullWidth type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Mengirim Formulir...' : 'Kirim Formulir'}
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Card>
                </Grid2>
            </Grid2>
            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} redirectPage={redirectPage} />
        </Box>
    )
}

export default RegistrationPage

'use client'

import { Box, Card, CardActionArea, CardContent, FormControl, FormLabel, Grid2, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import React, { useState } from 'react'
import CustomTextField from '../components/CustomTextField'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

interface Class {
    class_id: number
    program_id: number
    batch_id: number
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    is_active: boolean
}

interface Program {
    program_id: number
    program_name: string
    program_description: string
}
interface Batch {
    batch_id: number
    batch_number: number
    batch_start: string
    batch_end: string
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

    const [selectedProgram, setSelectedProgram] = useState<string>('')
    const [birthDate, setBirthDate] = React.useState<Date>()

    if (isLoading) {
        return <Box p={isMobile ? 2 : 4}>{/* Skeleton loading state */}</Box>
    }
    if (isError) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <Grid2 container justifyContent={'center'} sx={{ height: '100vh' }}>
                    <Grid2 size={{ xs: 10, sm: 10, lg: 4, xl: 4 }} display="flex" alignItems="center" flexDirection="column">
                        <Image src="/assets/images/syn-logo-dark.svg" alt="Syneps Academy Logo" width={150} height={150} />
                        <Typography variant="h3" textAlign="center" color="textPrimary">
                            Formulir Pendaftaran Syneps Academy
                        </Typography>
                        <Typography variant="subtitle1" textAlign="center" color="textPrimary" mb={4}>
                            Selamat datang di formulir pendaftaran Syneps Academy! Silahkan untuk mengisi data
                        </Typography>
                        <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '1000px' }}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <form action="">
                                    <Stack spacing={2}>
                                        <Typography variant="h5" fontWeight={600} component="label" htmlFor="program">
                                            Program yang ingin diikuti
                                        </Typography>
                                        <Grid2 container spacing={2} justifyContent={'center'}>
                                            {activeClass.Programs.map((program) => (
                                                <Grid2 key={program.program_id} sx={{ xs: 12, sm: 6, md: 4 }}>
                                                    <Card sx={{ mb: 2 }}>
                                                        <CardActionArea
                                                            onClick={() => setSelectedProgram(program.program_name)}
                                                            sx={{
                                                                height: '100%',
                                                                backgroundColor: selectedProgram === program.program_name ? theme.palette.action.selected : 'transparent',
                                                                '&:hover': {
                                                                    backgroundColor: theme.palette.action.hover
                                                                }
                                                            }}
                                                        >
                                                            <CardContent>
                                                                <Typography variant="h5">{program.program_name}</Typography>
                                                                <Typography variant="subtitle1">{program.program_description}</Typography>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </Card>
                                                </Grid2>
                                            ))}
                                        </Grid2>
                                        <Box>
                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <FormLabel>Nama Lengkap Sesuai KTP</FormLabel>
                                                <CustomTextField variant="outlined" fullWidth name="email" id="email" type="email" required />
                                            </FormControl>
                                        </Box>
                                        <Grid2 flexDirection={'column'}>
                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <FormLabel>Tempat Lahir</FormLabel>
                                                <CustomTextField variant="outlined" fullWidth name="email" id="email" type="email" required />
                                            </FormControl>
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
                                    </Stack>
                                </form>
                            </Box>
                        </Card>
                    </Grid2>
                </Grid2>
            </Box>
        </LocalizationProvider>
    )
}

export default RegistrationPage

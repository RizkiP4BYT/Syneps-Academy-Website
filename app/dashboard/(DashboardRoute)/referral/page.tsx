'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { createClient } from '@/utils/supabase/client'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Box, Button, ButtonGroup, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid2, useMediaQuery, useTheme, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'

interface Referrals {
    referral_id: string
    referrer: string
    referral_code: string
    discount_percentage: number
}

export default function ReferralPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: Referrals = [],
        isLoading,
        isError,
    } = useQuery<Referrals[]>({
        queryKey: ['Referrals'],
        queryFn: async () => {
            const res = await fetch('/api/referral')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        },
    })

    const mutation = useMutation({
        mutationFn: async (referral: Partial<Referrals>) => {
            const method = referral.referral_id ? 'PUT' : 'POST'
            const res = await fetch('/api/referral', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(referral),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Referrals'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Referral berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan referral')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (referral_id: string) => {
            const res = await fetch('/api/referral', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referral_id }),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Referrals'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Referral berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus referral')
        },
    })

    const modalBoxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '90%' : 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    }

    const [modalType, setModalType] = useState<'create' | 'edit'>('create')
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedReferral, setSelectedReferral] = useState<Referrals | null>(null)
    const [referrer, setReferrer] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [discountPercentage, setDiscountPercentage] = useState<number>(0)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            referral_id: selectedReferral?.referral_id,
            referrer: referrer,
            referral_code: referralCode,
            discount_percentage: discountPercentage,
        })
    }

    const handleDelete = (referral_id: string) => {
        deleteMutation.mutate(referral_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedReferral(null)
        setReferrer('')
        setDiscountPercentage(0)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedReferral(null)
    }

    useEffect(() => {
        if (selectedReferral) {
            setReferrer(selectedReferral.referrer)
            setDiscountPercentage(selectedReferral.discount_percentage)
        }
    }, [selectedReferral])

    if (isLoading) {
        return (
            <Box p={isMobile ? 2 : 4}>
                <Grid2 container justifyContent="space-between" alignItems="center" mb={3}>
                    <Grid2>
                        <Skeleton variant="text" width={200} height={40} />
                        <Skeleton variant="text" width={300} height={20} />
                    </Grid2>
                    <Grid2>
                        <Skeleton variant="rectangular" width={150} height={40} />
                    </Grid2>
                </Grid2>

                <TableContainer>
                    <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Skeleton variant="text" width={50} height={30} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={150} height={30} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={150} height={30} />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width={100} height={30} />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton variant="text" width={50} height={30} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={150} height={30} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width={150} height={30} />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="rectangular" width={120} height={40} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
    if (isError) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <Box p={isMobile ? 2 : 4}>
            <Grid2 container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid2>
                    <Typography variant="h4">Referral</Typography>
                    <Typography variant="body1">Manajemen Referral untuk diskon pada saat pendaftaran</Typography>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setModalType('create')
                            setModalOpen(true)
                        }}
                    >
                        Tambah Referral
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Referrer</TableCell>
                            <TableCell>Kode Referral</TableCell>
                            <TableCell>Diskon</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Referrals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data referral tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Referrals.map((referral, index) => (
                                <TableRow key={referral.referral_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{referral.referrer}</TableCell>
                                    <TableCell>{referral.referral_code}</TableCell>
                                    <TableCell>{referral.discount_percentage}%</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedReferral(referral)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedReferral(referral)
                                                    setDeleteModalOpen(true)
                                                }}
                                            >
                                                <Delete />
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={modalOpen} onClose={handleClose}>
                <Box sx={modalBoxStyle} component="form" onSubmit={handleSubmit}>
                    <Typography variant="h5" mb={3}>
                        {modalType === 'edit' ? 'Edit Referral' : 'Buat Referral Baru'}
                    </Typography>
                    <CustomTextField label="Referrer" value={referrer} onChange={(e) => setReferrer(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <CustomTextField label="Kode Referral" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <CustomTextField
                        label="Diskon (%)"
                        value={discountPercentage}
                        type="number"
                        onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                        fullWidth
                        rows={4}
                        required
                        sx={{ mb: 3 }}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Hapus Referral
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus referral ini? Tindakan ini berpengaruh pada nilai dari setiap kelas.
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedReferral && handleDelete(selectedReferral.referral_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

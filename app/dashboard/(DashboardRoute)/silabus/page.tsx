'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid2, useMediaQuery, useTheme, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'

interface Syllabuses {
    syllabus_id: string
    syllabus_name: string
    class_id: string
    minimum_criteria: number
}

export default function SilabusPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: Syllabuses = [],
        isLoading,
        isError
    } = useQuery<Syllabuses[]>({
        queryKey: ['Syllabuses'],
        queryFn: async () => {
            const res = await fetch('/api/syllabus')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async (syllabus: Partial<Syllabuses>) => {
            const method = syllabus.syllabus_id ? 'PUT' : 'POST'
            const res = await fetch('/api/syllabus', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(syllabus)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Syllabuses'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Silabus berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan silabus')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (syllabus_id: string) => {
            const res = await fetch('/api/syllabus', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ syllabus_id })
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Syllabuses'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Silabus berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus silabus')
        }
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
        borderRadius: 2
    }

    const [modalType, setModalType] = useState<'create' | 'edit'>('create')
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabuses | null>(null)
    const [namaSilabus, setNamaSilabus] = useState('')
    const [minimumCriteria, setMinimumCriteria] = useState<number>(0)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            syllabus_id: selectedSyllabus?.syllabus_id,
            syllabus_name: namaSilabus,
            minimum_criteria: minimumCriteria
        })
    }

    const handleDelete = (syllabus_id: string) => {
        deleteMutation.mutate(syllabus_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedSyllabus(null)
        setNamaSilabus('')
        setMinimumCriteria(0)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedSyllabus(null)
    }

    useEffect(() => {
        if (selectedSyllabus) {
            setNamaSilabus(selectedSyllabus.syllabus_name)
            setMinimumCriteria(selectedSyllabus.minimum_criteria)
        }
    }, [selectedSyllabus])

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
                    <Typography variant="h4">Silabus</Typography>
                    <Typography variant="body1">Manajemen Silabus untuk kelas</Typography>
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
                        Tambah Silabus
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Nama Silabus</TableCell>
                            <TableCell>Rata-Rata</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Syllabuses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data silabus tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Syllabuses.map((syllabus, index) => (
                                <TableRow key={syllabus.syllabus_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{syllabus.syllabus_name}</TableCell>
                                    <TableCell>{syllabus.minimum_criteria}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedSyllabus(syllabus)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedSyllabus(syllabus)
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
                        {modalType === 'edit' ? 'Edit Silabus' : 'Buat Silabus Baru'}
                    </Typography>
                    <CustomTextField label="Nama Silabus" value={namaSilabus} onChange={(e) => setNamaSilabus(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <CustomTextField label="Rata-Rata" value={minimumCriteria} type="number" onChange={(e) => setMinimumCriteria(Number(e.target.value))} fullWidth rows={4} required sx={{ mb: 3 }} />
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Hapus Silabus
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus silabus ini? Tindakan ini berpengaruh pada nilai dari setiap kelas.
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedSyllabus && handleDelete(selectedSyllabus.syllabus_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

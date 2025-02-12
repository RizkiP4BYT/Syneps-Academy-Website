'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { createClient } from '@/utils/supabase/client'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Box, Button, ButtonGroup, IconButton, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid2, useMediaQuery, useTheme, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'

interface Programs {
    program_id: string
    program_name: string
    program_description: string
}

export default function ProgramPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: Programs = [],
        isLoading,
        isError
    } = useQuery<Programs[]>({
        queryKey: ['Programs'],
        queryFn: async () => {
            const res = await fetch('/api/program')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async (program: Partial<Programs>) => {
            const method = program.program_id ? 'PUT' : 'POST'
            const res = await fetch('/api/program', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(program)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Programs'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Program berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan program')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (program_id: string) => {
            const res = await fetch('/api/program', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ program_id })
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Programs'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Program berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus program')
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
    const [selectedProgram, setSelectedProgram] = useState<Programs | null>(null)
    const [namaProgram, setNamaProgram] = useState('')
    const [deskripsiProgram, setDeskripsiProgram] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            program_id: selectedProgram?.program_id,
            program_name: namaProgram,
            program_description: deskripsiProgram
        })
    }

    const handleDelete = (program_id: string) => {
        deleteMutation.mutate(program_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedProgram(null)
        setNamaProgram('')
        setDeskripsiProgram('')
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedProgram(null)
    }

    useEffect(() => {
        if (selectedProgram) {
            setNamaProgram(selectedProgram.program_name)
            setDeskripsiProgram(selectedProgram.program_description)
        }
    }, [selectedProgram])

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
                    <Typography variant="h4">Program</Typography>
                    <Typography variant="body1">Manajemen program Syneps Academy</Typography>
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
                        Tambah Program
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Nama Program</TableCell>
                            <TableCell>Deskripsi</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Programs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data program tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Programs.map((program, index) => (
                                <TableRow key={program.program_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{program.program_name}</TableCell>
                                    <TableCell>{program.program_description}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedProgram(program)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedProgram(program)
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
                        {modalType === 'edit' ? 'Edit Program' : 'Buat Program Baru'}
                    </Typography>
                    <CustomTextField label="Nama Program" value={namaProgram} onChange={(e) => setNamaProgram(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <CustomTextField label="Deskripsi Program" value={deskripsiProgram} onChange={(e) => setDeskripsiProgram(e.target.value)} fullWidth multiline rows={4} required sx={{ mb: 3 }} />
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Hapus Program
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus program ini?
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedProgram && handleDelete(selectedProgram.program_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

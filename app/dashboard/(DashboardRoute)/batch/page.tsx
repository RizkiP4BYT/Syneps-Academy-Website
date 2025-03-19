'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid2, useMediaQuery, useTheme, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface Batches {
    batch_id: string
    batch_name: string
    batch_start: Date | null
    batch_end: Date | null
}

export default function BatchPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: Batches = [],
        isLoading,
        isError
    } = useQuery<Batches[]>({
        queryKey: ['Batches'],
        queryFn: async () => {
            const res = await fetch('/api/batch')
            if (!res.ok) throw new Error('Gagal memuat data')
            const data = await res.json()
            return data.map((batch: Batches) => ({
                ...batch,
                batch_start: batch.batch_start ? new Date(batch.batch_start) : null,
                batch_end: batch.batch_end ? new Date(batch.batch_end) : null
            }))
        }
    })

    const mutation = useMutation({
        mutationFn: async (batch: Partial<Batches>) => {
            const method = batch.batch_id ? 'PUT' : 'POST'
            const res = await fetch('/api/batch', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Batches'] })
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Batch berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan batch')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (batch_id: string) => {
            const res = await fetch('/api/batch', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batch_id })
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Batches'] })
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Batch berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus batch')
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
    const [selectedBatch, setSelectedBatch] = useState<Batches | null>(null)
    const [batchName, setBatchName] = useState<string>('')
    const [batchStart, setBatchStart] = useState<Date | null>(null)
    const [batchEnd, setBatchEnd] = useState<Date | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            batch_id: selectedBatch?.batch_id,
            batch_name: batchName,
            batch_start: batchStart,
            batch_end: batchEnd
        })
    }

    const handleDelete = (batch_id: string) => {
        deleteMutation.mutate(batch_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedBatch(null)
        setBatchStart(null)
        setBatchEnd(null)
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedBatch(null)
    }

    useEffect(() => {
        if (selectedBatch) {
            setBatchStart(selectedBatch.batch_start)
            setBatchEnd(selectedBatch.batch_end)
        } else {
            setBatchStart(null)
            setBatchEnd(null)
        }
    }, [selectedBatch])

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
                    <Typography variant="h4">Batch</Typography>
                    <Typography variant="body1">Manajemen batch Syneps Academy</Typography>
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
                        Tambah Batch
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Batch Start</TableCell>
                            <TableCell>Batch End</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Batches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data batch tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Batches.map((batch, index) => (
                                <TableRow key={batch.batch_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{batch.batch_name}</TableCell>
                                    <TableCell>{format(batch.batch_start!, 'dd MMMM yyyy - HH:mm', { locale: id })}</TableCell>
                                    <TableCell>{format(batch.batch_end!, 'dd MMMM yyyy - HH:mm', { locale: id })}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedBatch(batch)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedBatch(batch)
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
                        {modalType === 'edit' ? 'Edit Batch' : 'Buat Batch Baru'}
                    </Typography>
                    <CustomTextField label="Nama Batch" value={batchName} onChange={(e) => setBatchName(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                        <DateTimePicker
                            label="Start Batch"
                            value={batchStart}
                            onChange={(newValue) => setBatchStart(newValue)}
                            format="dd MMMM yyyy HH:mm"
                            sx={{
                                mb: 3
                            }}
                            slots={{
                                textField: CustomTextField
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true }
                            }}
                        />
                        <DateTimePicker
                            label="End Batch"
                            value={batchEnd}
                            onChange={(newValue) => setBatchEnd(newValue)}
                            format="dd MMMM yyyy HH:mm"
                            sx={{
                                mb: 3
                            }}
                            slots={{
                                textField: CustomTextField
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true }
                            }}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Hapus Batch
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus batch ini?
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedBatch && handleDelete(selectedBatch.batch_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

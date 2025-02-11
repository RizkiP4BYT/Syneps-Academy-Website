'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { createClient } from '@/utils/supabase/client'
import { Delete, Edit, Add } from '@mui/icons-material'
import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'

interface Kelas {
    id: number
    id_program: number
    id_batch: number
    nama_kelas: string
    deskripsi_kelas: string
    metode_pembayaran: string
    created_at: string
}

interface Program {
    id: number
    nama_program: string
}

interface Batch {
    id: number
    id_program: number
    batch_start: string
    batch_end: string
}

export default function KelasPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: Kelas = [],
        isLoading,
        isError
    } = useQuery<Kelas[]>({
        queryKey: ['Kelas'],
        queryFn: async () => {
            const res = await fetch('/api/kelas')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        }
    })

    const { data: Program = [] } = useQuery<Program[]>({
        queryKey: ['Program'],
        queryFn: async () => {
            const res = await fetch('/api/program')
            if (!res.ok) throw new Error('Gagal memuat data program')
            return res.json()
        }
    })

    const { data: Batch = [] } = useQuery<Batch[]>({
        queryKey: ['Batch'],
        queryFn: async () => {
            const res = await fetch('/api/batch')
            if (!res.ok) throw new Error('Gagal memuat data batch')
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async (kelas: Partial<Kelas>) => {
            const method = kelas.id ? 'PUT' : 'POST'
            const res = await fetch('/api/kelas', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kelas)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Kelas'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Kelas berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan kelas')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch('/api/kelas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Kelas'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Kelas berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus kelas')
        }
    })

    const addBatchMutation = useMutation({
        mutationFn: async (batch: Partial<Batch>) => {
            const res = await fetch('/api/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Batch'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Batch berhasil ditambahkan')
            handleCloseBatchModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menambahkan batch')
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
    const [batchModalOpen, setBatchModalOpen] = useState(false)
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)
    const [idProgram, setIdProgram] = useState<number | null>(null)
    const [idBatch, setIdBatch] = useState<number | null>(null)
    const [namaKelas, setNamaKelas] = useState('')
    const [deskripsiKelas, setDeskripsiKelas] = useState('')
    const [metodePembayaran, setMetodePembayaran] = useState('')
    const [startBatch, setStartBatch] = useState<Date | null>(null)
    const [endBatch, setEndBatch] = useState<Date | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            id: selectedKelas?.id,
            id_program: idProgram!,
            id_batch: idBatch!,
            nama_kelas: namaKelas,
            deskripsi_kelas: deskripsiKelas,
            metode_pembayaran: metodePembayaran
        })
    }

    const handleAddBatch = (e: FormEvent) => {
        e.preventDefault()
        if (!idProgram || !startBatch || !endBatch) {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('Harap isi semua field')
            return
        }
        addBatchMutation.mutate({
            batch_start: startBatch.toISOString(),
            batch_end: endBatch.toISOString()
        })
    }

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedKelas(null)
        setIdProgram(null)
        setIdBatch(null)
        setNamaKelas('')
        setDeskripsiKelas('')
        setMetodePembayaran('')
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedKelas(null)
    }

    const handleCloseBatchModal = () => {
        setBatchModalOpen(false)
        setIdProgram(null)
        setStartBatch(null)
        setEndBatch(null)
    }

    useEffect(() => {
        if (selectedKelas) {
            setIdProgram(selectedKelas.id_program)
            setIdBatch(selectedKelas.id_batch)
            setNamaKelas(selectedKelas.nama_kelas)
            setDeskripsiKelas(selectedKelas.deskripsi_kelas)
            setMetodePembayaran(selectedKelas.metode_pembayaran)
        }
    }, [selectedKelas])

    if (isLoading) return <div>Memuat...</div>
    if (isError) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <Box p={isMobile ? 2 : 4}>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid item>
                    <Typography variant="h4">Kelas</Typography>
                    <Typography variant="body1">Manajemen kelas Syneps Academy</Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            setModalType('create')
                            setModalOpen(true)
                        }}
                    >
                        Tambah Kelas
                    </Button>
                </Grid>
            </Grid>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Program</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Nama Kelas</TableCell>
                            <TableCell>Deskripsi Kelas</TableCell>
                            <TableCell>Metode Pembayaran</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Kelas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data kelas tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Kelas.map((kelas, index) => (
                                <TableRow key={kelas.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{kelas.id_program}</TableCell>
                                    <TableCell>{kelas.id_batch}</TableCell>
                                    <TableCell>{kelas.nama_kelas}</TableCell>
                                    <TableCell>{kelas.deskripsi_kelas}</TableCell>
                                    <TableCell>{kelas.metode_pembayaran}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedKelas(kelas)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedKelas(kelas)
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
                        {modalType === 'edit' ? 'Edit Kelas' : 'Buat Kelas Baru'}
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Program</InputLabel>
                        <Select value={idProgram || ''} onChange={(e) => setIdProgram(Number(e.target.value))} label="Program" required>
                            {Program.map((program) => (
                                <MenuItem key={program.id} value={program.id}>
                                    {program.nama_program}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Batch</InputLabel>
                        <Select value={idBatch || ''} onChange={(e) => setIdBatch(Number(e.target.value))} label="Batch" required>
                            {Batch.length > 0 &&
                                Batch.map((batch) => (
                                    <MenuItem key={batch.id} value={batch.id}>
                                        {`${format(new Date(batch.batch_start), 'dd MMMM yyyy - HH:mm')} -> ${format(new Date(batch.batch_end), 'dd MMMM yyyy - HH:mm')}`}
                                    </MenuItem>
                                ))}
                            <MenuItem onClick={() => setBatchModalOpen(true)}>
                                <Button>Tambah Batch</Button>
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <CustomTextField sx={{ mb: 3 }} fullWidth label="Nama Kelas" value={namaKelas} onChange={(e) => setNamaKelas(e.target.value)} required />
                    <CustomTextField sx={{ mb: 3 }} fullWidth label="Deskripsi Kelas" value={deskripsiKelas} onChange={(e) => setDeskripsiKelas(e.target.value)} required />
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Metode Pembayaran</InputLabel>
                        <Select value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)} label="Metode Pembayaran" required>
                            <MenuItem value="Cash">Cash</MenuItem>
                            <MenuItem value="Bank">Bank</MenuItem>
                            <MenuItem value="Cicilan">Cicilan</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">
                        Simpan
                    </Button>
                </Box>
            </Modal>

            <Modal open={batchModalOpen} onClose={handleCloseBatchModal}>
                <Box sx={modalBoxStyle} component="form" onSubmit={handleAddBatch}>
                    <Typography variant="h5" mb={3}>
                        Tambah Batch
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Start Batch"
                            value={startBatch}
                            onChange={(newValue) => setStartBatch(newValue)}
                            slots={{
                                textField: CustomTextField // Gunakan CustomTextField sebagai komponen input
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true } // Properti tambahan untuk CustomTextField
                            }}
                        />
                        <DateTimePicker
                            label="End Batch"
                            value={endBatch}
                            onChange={(newValue) => setEndBatch(newValue)}
                            slots={{
                                textField: CustomTextField // Gunakan CustomTextField sebagai komponen input
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true } // Properti tambahan untuk CustomTextField
                            }}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" color="primary">
                        Tambah Batch
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
        </Box>
    )
}

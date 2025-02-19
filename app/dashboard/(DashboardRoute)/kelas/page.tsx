'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    Box,
    Button,
    ButtonGroup,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Grid2,
    useMediaQuery,
    useTheme,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Skeleton,
    SelectChangeEvent,
    Switch,
    FormControlLabel,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { Delete, Edit, Add, PersonAdd, CircleTwoTone } from '@mui/icons-material'

interface Class {
    class_id: string
    program_id: string
    batch_id: string
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    participants: { user_id: string; user_name: string }[]
    syllabuses: Syllabuses[]
    is_active: boolean
}

interface ClassAPI {
    class_id: string
    program_id: string
    batch_id: string
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    participants: { user_id: string; user_name: string }[]
    syllabuses: string[]
    is_active: boolean
}

interface Program {
    program_id: string
    program_name: string
}

interface Batch {
    batch_id: string
    batch_number: number
    batch_start: string
    batch_end: string
}

interface User {
    user_id: string
    user_name: string
    user_level?: 'Siswa' | 'Pengajar' | 'Admin'
}

interface Syllabuses {
    created_at: string
    syllabus_id: string
    syllabus_name: string
    minimum_criteria: number
}

interface ClassesData {
    Classes: Class[]
    Programs: Program[]
    Batches: Batch[]
    Syllabuses: Syllabuses[]
}

export default function KelasPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: classesData = { Classes: [], Programs: [], Batches: [], Syllabuses: [] },
        isLoading,
        isError,
    } = useQuery<ClassesData>({
        queryKey: ['Classes'],
        queryFn: async () => {
            const res = await fetch('/api/class')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        },
    })

    const mutation = useMutation({
        mutationFn: async (kelas: Partial<ClassAPI>) => {
            const method = kelas.class_id ? 'PUT' : 'POST'
            const res = await fetch('/api/class', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(kelas),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Kelas berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan kelas')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (class_id: string) => {
            const res = await fetch('/api/class', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ class_id }),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Kelas berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus kelas')
        },
    })

    const addBatchMutation = useMutation({
        mutationFn: async (batch: Partial<Batch>) => {
            const res = await fetch('/api/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batch),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Batch berhasil ditambahkan')
            handleCloseBatchModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menambahkan batch')
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
    const [batchModalOpen, setBatchModalOpen] = useState(false)
    const [manageStudentsModalOpen, setManageStudentsModalOpen] = useState(false) // Modal untuk Kelola Siswa
    const [selectedKelas, setSelectedKelas] = useState<Class | null>(null)
    const [idProgram, setIdProgram] = useState<string | null>(null)
    const [idBatch, setIdBatch] = useState<string | null>(null)
    const [namaKelas, setNamaKelas] = useState('')
    const [deskripsiKelas, setDeskripsiKelas] = useState('')
    const [metodePembelajaran, setMetodePembelajaran] = useState('')
    const [silabus, setSilabus] = useState<string[]>([])
    const [startBatch, setStartBatch] = useState<Date | null>(null)
    const [endBatch, setEndBatch] = useState<Date | null>(null)
    const [classActive, setClassActive] = useState<boolean>(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')
    const [allStudents, setAllStudents] = useState<User[]>([])
    const [selectedStudents, setSelectedStudents] = useState<User[]>([])

    const { data: usersData = [] } = useQuery<User[]>({
        queryKey: ['Users'],
        queryFn: async () => {
            const res = await fetch('/api/user')
            if (!res.ok) throw new Error('Gagal memuat data pengguna')
            return res.json()
        },
    })

    useEffect(() => {
        if (usersData.length > 0) {
            // Ambil semua siswa
            const students = usersData.filter((user) => user.user_level === 'Siswa')
            // Hapus siswa yang sudah terdaftar di kelas dari daftar semua siswa
            const availableStudents = students.filter((student) => !selectedStudents.some((selected) => selected.user_id === student.user_id))
            setAllStudents(availableStudents)
        }
    }, [usersData, selectedStudents]) // Tambahkan selectedStudents sebagai dependensi

    useEffect(() => {
        if (selectedKelas) {
            setSelectedStudents(selectedKelas.participants || [])
        }
    }, [selectedKelas])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        mutation.mutate({
            class_id: selectedKelas?.class_id,
            program_id: idProgram!,
            batch_id: idBatch!,
            class_name: namaKelas,
            class_description: deskripsiKelas,
            learning_method: metodePembelajaran,
            syllabuses: silabus,
            is_active: classActive
        })
    }

    const handleAddBatch = (e: FormEvent) => {
        e.preventDefault()
        if (!startBatch || !endBatch) {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('Harap isi semua field')
            return
        }
        addBatchMutation.mutate({
            batch_start: startBatch.toISOString(),
            batch_end: endBatch.toISOString(),
        })
    }

    const handleDelete = (class_id: string) => {
        deleteMutation.mutate(class_id)
    }

    const handleAddStudent = (student: User) => {
        setSelectedStudents((prev) => [...prev, student])
        setAllStudents((prev) => prev.filter((s) => s.user_id !== student.user_id))
    }

    const handleRemoveStudent = (student: User) => {
        setSelectedStudents((prev) => prev.filter((s) => s.user_id !== student.user_id))
        setAllStudents((prev) => [...prev, student])
    }

    const saveStudentsMutation = useMutation({
        mutationFn: async (data: { class_id: string; participants: User[] }) => {
            const response = await fetch('/api/participant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error('Gagal menyimpan peserta')
            return response.json()
        },
        onSuccess: () => {
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Peserta berhasil disimpan')
            setManageStudentsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['Classes'] }) // Invalidate query untuk refresh data
        },
        onError: () => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage('Gagal menyimpan peserta')
        },
    })

    const handleSaveStudents = () => {
        saveStudentsMutation.mutate({
            class_id: selectedKelas!.class_id,
            participants: selectedStudents,
        })
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedKelas(null)
        setIdProgram(null)
        setIdBatch(null)
        setNamaKelas('')
        setDeskripsiKelas('')
        setMetodePembelajaran('')
        setSilabus([])
        setClassActive(false)
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

    const handleCloseManageStudentsModal = () => {
        setManageStudentsModalOpen(false)
    }

    const handleSilabusChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event
        const selectedSyllabuses = typeof value === 'string' ? value.split(',') : value
        setSilabus(selectedSyllabuses)
    }

    useEffect(() => {
        if (selectedKelas) {
            setIdProgram(selectedKelas.program_id)
            setIdBatch(selectedKelas.batch_id)
            setNamaKelas(selectedKelas.class_name)
            setDeskripsiKelas(selectedKelas.class_description)
            setMetodePembelajaran(selectedKelas.learning_method)
            setSilabus(selectedKelas.syllabuses.map((sy) => sy.syllabus_id))
            setSelectedStudents(selectedKelas.participants || [])
        }
    }, [selectedKelas])

    useEffect(() => {
        if (manageStudentsModalOpen && selectedKelas) {
            setSelectedStudents(selectedKelas.participants || []) // Set peserta saat modal dibuka
        }
    }, [manageStudentsModalOpen, selectedKelas])

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
                    <Typography variant="h4">Kelas</Typography>
                    <Typography variant="body1">Manajemen kelas Syneps Academy</Typography>
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
                        Tambah Kelas
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Program</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Nama Kelas</TableCell>
                            <TableCell>Deskripsi Kelas</TableCell>
                            <TableCell>Metode</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!classesData.Classes ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data kelas tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            classesData.Classes.map((item, index) => (
                                <TableRow key={item.class_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{classesData.Programs.find((program) => program.program_id === item.program_id)?.program_name}</TableCell>
                                    <TableCell>{classesData.Batches.find((batch) => batch.batch_id === item.batch_id)?.batch_number}</TableCell>
                                    <TableCell>{item.class_name}</TableCell>
                                    <TableCell>{item.class_description}</TableCell>
                                    <TableCell>{item.learning_method}</TableCell>
                                    <TableCell align='center'>{item.is_active ? <CircleTwoTone color='success'/> : <CircleTwoTone color='error'/>}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedKelas(item)
                                                    setClassActive(item.is_active)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedKelas(item)
                                                    setDeleteModalOpen(true)
                                                }}
                                            >
                                                <Delete />
                                            </Button>
                                            <Button
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedKelas(item)
                                                    setManageStudentsModalOpen(true) // Buka modal Kelola Siswa
                                                }}
                                            >
                                                <PersonAdd />
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
                        <Select value={idProgram || ''} onChange={(e) => setIdProgram(e.target.value)} label="Program" required>
                            {classesData.Programs.map((program) => (
                                <MenuItem key={program.program_id} value={program.program_id}>
                                    {program.program_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Batch</InputLabel>
                        <Select value={idBatch || ''} onChange={(e) => setIdBatch(e.target.value)} label="Batch" required>
                            {classesData.Batches.map((batch) => (
                                <MenuItem key={batch.batch_id} value={batch.batch_id}>
                                    Batch {batch.batch_number} (
                                    {`${format(new Date(batch.batch_start), 'dd MMMM yyyy - HH:mm', { locale: id })} -> ${format(new Date(batch.batch_end), 'dd MMMM yyyy - HH:mm', {
                                        locale: id,
                                    })}`}
                                    )
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
                        <InputLabel>Metode Pembelajaran *</InputLabel>
                        <Select value={metodePembelajaran} onChange={(e) => setMetodePembelajaran(e.target.value)} label="Metode Pembelajaran" required>
                            <MenuItem value="Online">Online</MenuItem>
                            <MenuItem value="Offline">Offline</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Silabus *</InputLabel>
                        <Select value={silabus} onChange={(e) => handleSilabusChange(e)} label="Silabus" multiple required>
                            {classesData.Syllabuses &&
                                classesData.Syllabuses.map((syllabus) => (
                                    <MenuItem key={syllabus.syllabus_id} value={syllabus.syllabus_id}>
                                        {syllabus.syllabus_name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <FormControlLabel control={<Switch checked={classActive} onChange={(e) => setClassActive(e.target.checked)}/>} label="Aktifkan kelas?"/>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                        <DateTimePicker
                            label="Start Batch"
                            value={startBatch}
                            onChange={(newValue) => setStartBatch(newValue)}
                            format="dd MMMM yyyy HH:mm"
                            slots={{
                                textField: CustomTextField,
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true },
                            }}
                        />
                        <DateTimePicker
                            label="End Batch"
                            value={endBatch}
                            onChange={(newValue) => setEndBatch(newValue)}
                            format="dd MMMM yyyy HH:mm"
                            slots={{
                                textField: CustomTextField,
                            }}
                            slotProps={{
                                textField: { fullWidth: true, required: true },
                            }}
                        />
                    </LocalizationProvider>
                    <Button type="submit" variant="contained" color="primary">
                        Tambah Batch
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
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedKelas && handleDelete(selectedKelas.class_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <Modal open={manageStudentsModalOpen} onClose={handleCloseManageStudentsModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Kelola Siswa pada kelas {selectedKelas?.class_name}
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 sx={{xs:6}}>
                            <Typography variant="h6">Semua Siswa</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nama</TableCell>
                                            <TableCell>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStudents.map((student) => (
                                            <TableRow key={student.user_id}>
                                                <TableCell>{student.user_name}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" onClick={() => handleAddStudent(student)}>
                                                        &gt;
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid2>
                        <Grid2 sx={{xs:6}}>
                            <Typography variant="h6">Siswa di Kelas</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nama</TableCell>
                                            <TableCell>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedStudents.map((student) => (
                                            <TableRow key={student.user_id}>
                                                <TableCell>{student.user_name}</TableCell>
                                                <TableCell>
                                                    <Button variant="contained" onClick={() => handleRemoveStudent(student)}>
                                                        &lt;
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid2>
                    </Grid2>
                    <Button variant="contained" color="primary" onClick={handleSaveStudents}>
                        Simpan
                    </Button>
                    <Button variant="outlined" onClick={handleCloseManageStudentsModal}>
                        Batal
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
        </Box>
    )
}

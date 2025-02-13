'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { createClient } from '@/utils/supabase/client'
import { Delete, Edit, Add } from '@mui/icons-material'
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
    Skeleton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'

interface Class {
    class_id: string
    program_id: string
    batch_id: string
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    participants: {
        scores: { score: number; score_id: string; syllabus_id: string }[]
        user_id: string
        user_name: string
    }[]
    syllabuses: Syllabuses[]
    scores: {
        score: number
        score_id: string
        syllabus_id: string
        class_id: string
    }
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

interface Syllabuses {
    created_at: string
    syllabus_id: string
    syllabus_name: string
    minimum_criteria: number
}

interface Scores {
    score: number
    user_id: string
    score_id: string
    syllabus_id: string
}

interface ClassesData {
    Classes: Class[]
    Programs: Program[]
    Batches: Batch[]
    Syllabuses: Syllabuses[]
    Scores: Scores[]
}

export default function PenilaianPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedScore, setSelectedScore] = useState<Scores | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')
    const [score, setScore] = useState<number | undefined>(undefined)
    const [syllabusId, setSyllabusId] = useState<string>('')

    const {
        data: classesData = { Classes: [], Programs: [], Batches: [], Syllabuses: [], Scores: [] },
        isLoading: isLoadingClasses,
        isError: isErrorClasses,
    } = useQuery<ClassesData>({
        queryKey: ['Classes'],
        queryFn: async () => {
            const res = await fetch('/api/class')
            if (!res.ok) throw new Error('Gagal memuat data kelas')
            return res.json()
        },
    })

    const {
        data: scoresData = [],
        isLoading: isLoadingScores,
        isError: isErrorScores,
    } = useQuery<Scores[]>({
        queryKey: ['Scores', selectedClassId],
        queryFn: async () => {
            if (!selectedClassId) return []
            const res = await fetch(`/api/score?class_id=${selectedClassId}`)
            if (!res.ok) throw new Error('Gagal memuat data nilai')
            return res.json()
        },
        enabled: !!selectedClassId,
    })

    const mutation = useMutation({
        mutationFn: async (score: Partial<Scores>) => {
            const method = score.score_id ? 'PUT' : 'POST'
            const res = await fetch('/api/score', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(score),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Scores', selectedClassId] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Nilai berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan nilai')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async (score_id: string) => {
            const res = await fetch('/api/score', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score_id }),
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Scores', selectedClassId] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Nilai berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus nilai')
        },
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            score_id: selectedScore?.score_id,
            user_id: selectedScore?.user_id, // Assuming user_id is set elsewhere
            syllabus_id: syllabusId,
            score: score,
        })
    }

    const handleDelete = (score_id: string) => {
        deleteMutation.mutate(score_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedScore(null)
        setScore(undefined)
        setSyllabusId('')
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedScore(null)
    }

    useEffect(() => {
        if (selectedScore) {
            setScore(selectedScore.score)
            setSyllabusId(selectedScore.syllabus_id)
        }
    }, [selectedScore])

    if (isLoadingClasses || isLoadingScores) {
        return (
            <Box p={isMobile ? 2 : 4}>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={300} height={20} />
                <Skeleton variant="rectangular" width={150} height={40} />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Skeleton />
                                </TableCell>
                                <TableCell>
                                    <Skeleton />
                                </TableCell>
                                <TableCell>
                                    <Skeleton />
                                </TableCell>
                                <TableCell>
                                    <Skeleton />
                                </TableCell>
                                <TableCell>
                                    <Skeleton />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
    if (isErrorClasses || isErrorScores) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <Box p={isMobile ? 2 : 4}>
            <Grid2 container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid2>
                    <Typography variant="h4">Penilaian</Typography>
                    <Typography variant="body1">Manajemen penilaian siswa</Typography>
                </Grid2>
                <Grid2>
                    <FormControl fullWidth>
                        <InputLabel id="select-class-label">Pilih Kelas</InputLabel>
                        <Select labelId="select-class-label" value={selectedClassId || ''} onChange={(e) => setSelectedClassId(e.target.value)}>
                            {classesData.Classes.map((item) => (
                                <MenuItem key={item.class_id} value={item.class_id}>
                                    Batch {classesData.Batches.find((batch) => batch.batch_id === item.batch_id)?.batch_number}{' '}
                                    {classesData.Programs.find((program) => program.program_id === item.program_id)?.program_name} {item.class_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Siswa</TableCell>
                            {selectedClassId ? (
                                classesData.Classes.find((cl) => cl.class_id === selectedClassId)!.syllabuses.map((syllabus) => (
                                    <TableCell key={syllabus.syllabus_id}>{syllabus.syllabus_name}</TableCell>
                                ))
                            ) : (
                                <TableCell>Silabus</TableCell>
                            )}
                            <TableCell>Nilai Akhir</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {scoresData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data penilaian tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            scoresData.map((score, index) => (
                                <TableRow key={score.score_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{classesData.Classes.find((cl) => cl.class_id === selectedClassId)!.participants.find((p) => p.user_id === score.user_id)?.user_name}</TableCell>
                                    {selectedClassId ? (
                                        classesData.Classes.find((cl) => cl.class_id === selectedClassId)!.participants.map((participant) =>
                                            participant.scores.map((scores) => <TableCell key={scores.score_id}>{scores.score ?? 0}</TableCell>)
                                        )
                                    ) : (
                                        <TableCell>Silabus</TableCell>
                                    )}
                                    <TableCell>{score.score}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedScore(score)
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedScore(score)
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

            {/* <Modal open={modalOpen} onClose={handleClose}>
                <Box sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
                    <Typography variant="h5" mb={3}>
                        {selectedScore ? 'Edit Nilai' : 'Buat Nilai Baru'}
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="select-syllabus-label">Pilih Silabus</InputLabel>
                        <Select
                            labelId="select-syllabus-label"
                            value={syllabusId}
                            onChange={(e) => setSyllabusId(e.target.value)}
                            required
                        >
                            {selectedClassId && classesData.find(c => c.class_id === selectedClassId)?.syllabuses.map((syllabus) => (
                                <MenuItem key={syllabus.syllabus_id} value={syllabus.syllabus_id}>
                                    {syllabus.syllabus_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <CustomTextField
                        label="Nilai"
                        type="number"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        fullWidth
                        required
                        sx={{ mb: 3 }}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal> */}

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={{ p: 4 }}>
                    <Typography variant="h5" mb={3}>
                        Hapus Nilai
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus nilai ini?
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedScore && handleDelete(selectedScore.score_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

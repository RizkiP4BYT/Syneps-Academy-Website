'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { Edit, Add } from '@mui/icons-material'
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
    FormControl
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
        scores: {
            score: number
            score_id: string
            syllabus_id: string
            class_id: string
        }[]
        user_id: string
        user_name: string
    }[]
    syllabuses: Syllabuses[]
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
    score_id?: string
    user_id: string
    syllabus_id: string
    class_id: string
}

interface ScoresAPI {
    scores: Scores[]
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

    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
    const [participantName, setParticipantName] = useState<string | null>(null)
    const [selectedParticipant, setSelectedParticipant] = useState<Scores[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')
    const [editMode, setEditMode] = useState<boolean>(false)

    const {
        data: classesData = { Classes: [], Programs: [], Batches: [], Syllabuses: [], Scores: [] },
        isLoading: isLoadingClasses,
        isError: isErrorClasses
    } = useQuery<ClassesData>({
        queryKey: ['Classes'],
        queryFn: async () => {
            const res = await fetch('/api/class')
            if (!res.ok) throw new Error('Gagal memuat data kelas')
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async (score: Partial<ScoresAPI>) => {
            const method = editMode ? 'PUT' : 'POST'
            const res = await fetch('/api/score', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(score)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Classes'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('Nilai berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan nilai')
        }
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            scores: selectedParticipant
        })
    }

    const handleClose = () => {
        setModalOpen(false)
        setParticipantName(null)
        setSelectedParticipant([])
    }
console.log(classesData)
    useEffect(() => {
        if (selectedClassId) {
            const classData = classesData.Classes.find((cl) => cl.class_id === selectedClassId)
            setSelectedClass(classData!)
        }
    }, [classesData.Classes, selectedClassId])

    useEffect(() => {
        const classData = classesData.Classes.find((cl) => cl.class_id === selectedClassId)
            setSelectedClass(classData!)
    }, [classesData, selectedClassId])

    if (isLoadingClasses) {
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
    if (isErrorClasses) return <div>Terjadi kesalahan saat memuat data</div>

    return (
        <Box p={isMobile ? 2 : 4}>
            <Grid2 container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid2>
                    <Typography variant="h4">Penilaian</Typography>
                    <Typography variant="body1">Manajemen penilaian siswa</Typography>
                </Grid2>
                <Grid2>
                    <FormControl fullWidth sx={{ width: '20rem' }}>
                        <InputLabel id="select-class-label">Pilih Kelas</InputLabel>
                        <Select labelId="select-class-label" value={selectedClassId || ''} onChange={(e) => setSelectedClassId(e.target.value)} fullWidth>
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
                            {selectedClassId ? selectedClass?.syllabuses.map((syllabus) => <TableCell key={syllabus.syllabus_id}>{syllabus.syllabus_name}</TableCell>) : <TableCell>Silabus</TableCell>}
                            <TableCell>Nilai Akhir</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!selectedClass ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Kelas belum dipilih
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : !selectedClass?.participants ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada peserta pada kelas ini
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedClass?.participants.map((cp, index) => (
                                <TableRow key={cp.user_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{cp.user_name}</TableCell>
                                    {selectedClassId ? (
                                        selectedClass.syllabuses.map((syllabus) => (
                                            <TableCell key={syllabus.syllabus_id}>{cp.scores?.find((score) => score.syllabus_id === syllabus.syllabus_id)?.score ?? 0}</TableCell>
                                        ))
                                    ) : (
                                        <TableCell>Silabus</TableCell>
                                    )}
                                    <TableCell>{cp.scores ? (cp.scores?.reduce((acc, score) => acc + score.score, 0) / cp.scores.length).toFixed(2) : "0"}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            {!cp.scores ? (
                                                <Button
                                                    color="info"
                                                    onClick={() => {
                                                        setEditMode(false)
                                                        setParticipantName(cp.user_name)
                                                        setSelectedParticipant(
                                                            selectedClass?.syllabuses.map((syllabus) => ({
                                                                score: 0,
                                                                syllabus_id: syllabus.syllabus_id,
                                                                user_id: cp.user_id,
                                                                class_id: selectedClass.class_id
                                                            }))
                                                        )
                                                        setModalOpen(true)
                                                    }}
                                                >
                                                    <Add />
                                                </Button>
                                            ) : (
                                                <Button
                                                    color="info"
                                                    onClick={() => {
                                                        setEditMode(true)
                                                        setParticipantName(cp.user_name)
                                                        setSelectedParticipant(
                                                            cp.scores.map((score) => ({
                                                                ...score,
                                                                user_id: cp.user_id
                                                            }))
                                                        )
                                                        setModalOpen(true)
                                                    }}
                                                >
                                                    <Edit />
                                                </Button>
                                            )}
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedClass?.participants && (
                <Modal open={modalOpen} onClose={handleClose}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: isMobile ? '90%' : '50%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2
                        }}
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <Typography variant="h5" mb={3}>
                            {editMode ? 'Edit Nilai' : 'Buat Nilai Baru'}
                        </Typography>

                        {/* Tampilkan Nama Siswa */}
                        {selectedParticipant && (
                            <Typography variant="body1" mb={3}>
                                Nama Siswa: {participantName}
                            </Typography>
                        )}

                        {/* Input Nilai untuk Setiap Silabus */}
                        {selectedClass?.syllabuses.map((syllabus) => (
                            <CustomTextField
                                key={syllabus.syllabus_id}
                                label={syllabus.syllabus_name}
                                type="number"
                                value={selectedParticipant.find((score) => score.syllabus_id === syllabus.syllabus_id)?.score || ''}
                                onChange={(e) => {
                                    setSelectedParticipant((prevScores) =>
                                        prevScores.map((score) => (score.syllabus_id === syllabus.syllabus_id ? { ...score, score: Number(e.target.value) || 0 } : score))
                                    )
                                }}
                                fullWidth
                                required
                                sx={{ mb: 2 }}
                            />
                        ))}

                        {/* Tombol Simpan */}
                        <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </Box>
                </Modal>
            )}

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

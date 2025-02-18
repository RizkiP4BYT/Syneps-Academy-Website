'use client'

import CustomSnackbar from '@/app/components/CustomSnackbar'
import CustomTextField from '@/app/components/CustomTextField'
import { Add, Delete, Edit } from '@mui/icons-material'
import { Box, Button, ButtonGroup, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid2, useMediaQuery, useTheme, Skeleton } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { FormEvent, useEffect, useState } from 'react'

interface User {
    user_id: string
    user_name: string
    user_level: 'Siswa' | 'Pengajar' | 'Admin'
}

export default function UserPage() {
    const queryClient = useQueryClient()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const {
        data: users = [],
        isLoading,
        isError
    } = useQuery<User[]>({
        queryKey: ['Users'],
        queryFn: async () => {
            const res = await fetch('/api/user')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        }
    })

    const mutation = useMutation({
        mutationFn: async (user: Partial<User>) => {
            const method = user.user_id ? 'PUT' : 'POST'
            const res = await fetch('/api/user', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Users'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('User berhasil disimpan')
            handleClose()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menyimpan User')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (user_id: string) => {
            const res = await fetch('/api/user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id })
            })
            if (!res.ok) throw new Error(await res.json().then((data) => data.error))
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Users'] })
            setSnackbarOpen(true)
            setSnackbarSeverity('success')
            setSnackbarMessage('User berhasil dihapus')
            handleCloseDeleteModal()
        },
        onError: (error) => {
            setSnackbarOpen(true)
            setSnackbarSeverity('error')
            setSnackbarMessage(error.message || 'Gagal menghapus User')
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [userName, setUserName] = useState('')
    const [userLevel, setUserLevel] = useState<'Siswa' | 'Pengajar' | 'Admin'>('Siswa')
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info')

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        mutation.mutate({
            user_id: selectedUser?.user_id,
            user_name: userName,
            user_level: userLevel
        })
    }

    const handleDelete = (user_id: string) => {
        deleteMutation.mutate(user_id)
    }

    const handleClose = () => {
        setModalOpen(false)
        setSelectedUser(null)
        setUserName('')
        setUserLevel('Siswa')
    }

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false)
        setSelectedUser(null)
    }

    useEffect(() => {
        if (selectedUser) {
            setUserName(selectedUser.user_name)
            setUserLevel(selectedUser.user_level)
        }
    }, [selectedUser])

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
                    <Typography variant="h4">User</Typography>
                    <Typography variant="body1">Manajemen User Syneps Academy</Typography>
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
                        Tambah User
                    </Button>
                </Grid2>
            </Grid2>

            <TableContainer>
                <Table sx={{ minWidth: isMobile ? 300 : 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>Nama User</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        Tidak ada data User tersedia.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.user_name}</TableCell>
                                    <TableCell>{user.user_level}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="contained" size={isMobile ? 'small' : 'medium'}>
                                            <Button
                                                color="info"
                                                onClick={() => {
                                                    setSelectedUser(user)
                                                    setModalType('edit')
                                                    setModalOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedUser(user)
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
                        {modalType === 'edit' ? 'Edit User' : 'Buat User Baru'}
                    </Typography>
                    <CustomTextField label="Nama User" value={userName} onChange={(e) => setUserName(e.target.value)} fullWidth required sx={{ mb: 3 }} />
                    <CustomTextField
                        label="Level User"
                        value={userLevel}
                        onChange={(e) => setUserLevel(e.target.value as 'Siswa' | 'Pengajar' | 'Admin')}
                        fullWidth
                        select
                        SelectProps={{ native: true }}
                        required
                        sx={{ mb: 3 }}
                    >
                        <option value="Siswa">Siswa</option>
                        <option value="Pengajar">Pengajar</option>
                        <option value="Admin">Admin</option>
                    </CustomTextField>
                    <Button type="submit" variant="contained" fullWidth disabled={mutation.isPending}>
                        {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </Box>
            </Modal>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalBoxStyle}>
                    <Typography variant="h5" mb={3}>
                        Hapus User
                    </Typography>
                    <Typography variant="body1" mb={3}>
                        Apakah Anda yakin ingin menghapus User ini?
                    </Typography>
                    <Button variant="contained" color="error" fullWidth onClick={() => selectedUser && handleDelete(selectedUser.user_id)}>
                        Hapus
                    </Button>
                </Box>
            </Modal>

            <CustomSnackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
        </Box>
    )
}

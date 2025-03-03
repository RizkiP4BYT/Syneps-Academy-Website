'use client'

import React from 'react'
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const SuccessPage = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const router = useRouter()

    const handleBackToHome = () => {
        router.push('/')
    }

    return (
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
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" textAlign="center" p={isMobile ? 2 : 4}>
                <Image src="/assets/images/syn-logo-dark.svg" alt="Syneps Academy Logo" width={150} height={150} />
                <Typography variant="h3" color="textPrimary" mt={4} mb={2}>
                    Pendaftaran Berhasil!
                </Typography>
                <Typography variant="subtitle1" color="textPrimary" mb={4}>
                    Terima kasih telah mendaftar di Syneps Academy. Tim kami akan segera menghubungi Anda untuk proses selanjutnya.
                </Typography>
                <Button variant="contained" size="large" onClick={handleBackToHome} sx={{ mt: 4 }}>
                    Kembali ke Beranda
                </Button>
            </Box>
        </Box>
    )
}

export default SuccessPage

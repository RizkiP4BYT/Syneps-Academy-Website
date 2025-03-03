import React from 'react'
import { Snackbar, Alert, Slide } from '@mui/material'
import { useRouter } from 'next/navigation'

interface CustomSnackbarProps {
    open: boolean
    onClose: () => void
    message: string
    severity: 'success' | 'error' | 'info' | 'warning'
    redirectPage?: string | null
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ open, onClose, message, severity, redirectPage }) => {
    const router = useRouter()

    const handleClose = () => {
        onClose()
        if (redirectPage) {
            router.push(redirectPage)
        }
    }

    return (
        <Snackbar open={open} onClose={handleClose} autoHideDuration={3000} TransitionComponent={Slide} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <Alert
                severity={severity}
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    fontSize: '1rem'
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

export default CustomSnackbar

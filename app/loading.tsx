// Loading.tsx
'use client'

import { LinearProgress, Box } from '@mui/material'

export default function Loading() {
    return (
        <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
            <LinearProgress />
        </Box>
    )
}

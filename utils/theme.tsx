'use client'
import { createTheme } from '@mui/material/styles'
import { Plus_Jakarta_Sans } from 'next/font/google'

export const plus = Plus_Jakarta_Sans({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif']
})

export const mainTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#208da8'
        },
        secondary: {
            main: '#6ad0cc'
        },
        error: {
            main: '#d32f2f'
        }
    },
    typography: {
        fontFamily: plus.style.fontFamily,
        h1: {
            fontSize: '2.5rem',
            lineHeight: 2.75,
            fontWeight: 600
        },
        h2: {
            fontSize: '2rem',
            lineHeight: 2.25,
            fontWeight: 600
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 2
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.3rem',
            lineHeight: 1.6
        },
        h5: {
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.6
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1
        }
    }
})

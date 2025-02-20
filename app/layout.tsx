'use client'
import dynamic from 'next/dynamic'
const ThemeProvider = dynamic(() => import('@mui/material').then((e) => e.ThemeProvider), { ssr: false })
const CssBaseline = dynamic(() => import('@mui/material').then((e) => e.CssBaseline), { ssr: false })
import { mainTheme } from '@/utils/theme'
import { ReactQueryClientProvider } from './components/ReactQueryClientProvider'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { id } from 'date-fns/locale'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryClientProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
                <html lang="en" suppressHydrationWarning>
                    <body>
                        <ThemeProvider theme={mainTheme}>
                            <CssBaseline />
                            {children}
                        </ThemeProvider>
                    </body>
                </html>
            </LocalizationProvider>
        </ReactQueryClientProvider>
    )
}

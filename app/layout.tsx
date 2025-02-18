'use client'
import dynamic from 'next/dynamic'
const ThemeProvider = dynamic(() => import('@mui/material').then((e) => e.ThemeProvider), { ssr: false })
const CssBaseline = dynamic(() => import('@mui/material').then((e) => e.CssBaseline), { ssr: false })
import { mainTheme } from '@/utils/theme'
import { ReactQueryClientProvider } from './components/ReactQueryClientProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryClientProvider>
            <html lang="en" suppressHydrationWarning>
                <body>
                    <ThemeProvider theme={mainTheme}>
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ReactQueryClientProvider>
    )
}

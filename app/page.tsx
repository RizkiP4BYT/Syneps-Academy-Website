import Image from 'next/image'
import styles from './page.module.css'
import { Metadata } from 'next'
import { Button } from '@mui/material'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Syneps Academy - Sekolah Jadi Programmer!',
    description: 'Generated by create next app'
}

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.imageWrapper}>
                    <Image objectFit="cover" width="250" height="250" src="/assets/images/syn-logo-dark.svg" alt="Syneps Academy logo" priority />
                </div>
                <Link href={'/dashboard'}>
                    <Button fullWidth variant="contained">
                        Go To Dashboard!
                    </Button>
                </Link>
                <Link href={'/registrationv2'}>
                    <Button fullWidth color="success" variant="contained">
                        Registration Page
                    </Button>
                </Link>
                <ol>
                    <li>
                        Get started by editing <code>app/page.tsx</code>.
                    </li>
                    <li>Save and see your changes instantly.</li>
                </ol>

                <div className={styles.ctas}>
                    <a
                        className={styles.primary}
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image className={styles.logo} src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
                        Deploy now
                    </a>
                    <a
                        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondary}
                    >
                        Read our docs
                    </a>
                </div>
            </main>
            <footer className={styles.footer}>
                <a href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    )
}

import './globals.css'
import type { Metadata } from 'next'
import Background from '@/components/Background'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: 'srakunpl',
  description: 'srakunpl 2.0 on Next.js',
}

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode
    }) {
    return (
        <html lang="pl">
            <UserProvider>
                <body className='font-mono bg-cyan-800 text-cyan-300'>
                    <Background />
                    <Navbar />
                    <div className='mb-20'/>
                    {children}
                </body>
            </UserProvider>
        </html>
    )
}

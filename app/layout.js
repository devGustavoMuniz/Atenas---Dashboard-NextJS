import { Inter } from 'next/font/google'
import { EdgeStoreProvider } from 'lib/edgestore';
import './ui/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Atenas Formatura',
  description: 'Empresa de fotografia focada na criação de experiências, com foco em atender o cliente da melhor maneira possível',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}><EdgeStoreProvider>{children}</EdgeStoreProvider></body>
    </html>
  )
}

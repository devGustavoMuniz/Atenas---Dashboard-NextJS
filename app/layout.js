import { Inter } from 'next/font/google';
import './ui/globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Atenas Formaturas',
  description: 'Empresa de fotografia focada na criação de experiências, com foco em atender o cliente da melhor maneira possível',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/home/assets/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

import '@/styles/global.css';
import { Inter, Cinzel } from 'next/font/google';
import MainProvider from './MainProvider';
import { LayoutProvider } from './layoutContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
});

export const metadata = {
  title: 'Amalia Ec',
  description: 'Tienda de Perfumes y Maquillajes en Ecuador',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/assets/logo_Cropped.png" />
      </head>
      <body>
        <LayoutProvider>
          <MainProvider>
            {children}
          </MainProvider>
        </LayoutProvider>          
      </body>
    </html>
  );
}
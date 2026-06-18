import './globals.css';
import { Bebas_Neue, Black_Ops_One, IBM_Plex_Sans } from 'next/font/google';

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body'
});

const bebasNeue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-heading'
});

const blackOpsOne = Black_Ops_One({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-logo'
});

export const metadata = {
    title: 'OopsAPI',
    description: 'Portal OopsAPI com rotas reais para demonstrar validacoes no frontend e no backend.'
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt" className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${blackOpsOne.variable}`}>
            <body>{children}</body>
        </html>
    );
}

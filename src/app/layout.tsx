import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkout App - Sua loja online",
  description: 'Sistema completo de checkout com React 19, Next.js 15 e TypeScript',
  keywords: ['e-commerce', 'checkout', 'pagamento', 'pix', 'cartão'],
  authors: [{ name: 'Flávio Santos' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        >
          Pular para o conteúdo principal
        </a>

        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              {/* Header */}

              <main
                id="main-content"
                className="container mx-auto px-4 py-8"
                role="main"
              >
                {children}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

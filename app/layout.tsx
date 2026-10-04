import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ViscoAr — Catálogo de lubricación",
  description: "Tu catálogo de lubricación. Consultá, organizá y gestioná fichas técnicas desde un solo lugar.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

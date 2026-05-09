import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestor de Eventos Académicos",
  description: "MVP para gestionar eventos académicos con Next.js y Supabase.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz-BSI",
  description: "Simulator Ujian SKD dan Psikotes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

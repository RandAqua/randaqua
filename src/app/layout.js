import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../custom/aquabg-fixes.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RandAqua - Генератор случайных чисел",
  description: "RandAqua - революционная система генерации случайных чисел на основе наблюдения за морской жизнью",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

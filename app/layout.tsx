import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ReactFlowProvider } from "@xyflow/react";

export const metadata: Metadata = {
  title: "Visualization",
  description: "Created by Neel and Chase",
};

const arrayFont = localFont({
  src: [
    {
      path: "./fonts/Array/Array-Regular.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-array",
});
const satoshiFont = localFont({
  src: [
    {
      path: "./fonts/Satoshi/Satoshi-Variable.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${arrayFont.variable} ${satoshiFont.variable}`}>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </body>
    </html>
  );
}

// src/app/layout.tsx
'use client';

import { Inter } from "next/font/google";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
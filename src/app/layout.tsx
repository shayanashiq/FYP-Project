import React from "react";
import { Inter } from "next/font/google";
import "@/assets/style/globals.css";
import Provider from "@/context/client-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/shared/toaster";

const inter = Inter({ subsets: ["latin"] });
const canonicalUrl = "http://localhost:3000/";

export const metadata = {
  title: "AVA Health",
  description: "AVA One: Your #1 Solution For The Best Seamless Healthcare",
  keywords: "avaone, doctors, patients, healthcare, medical",
  icons: {
    icon: '/new-logo.png',
  },
  openGraph: {
    title: "AVA Health",
    description: "AVA One: Your #1 Solution For The Best Seamless Healthcare",
    url: canonicalUrl,
    image: "/new-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Provider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
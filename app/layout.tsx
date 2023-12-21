import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import Sidebar from "./components/Sidebar";
import Navbar from "@/app/components/Navbar";
import ToasterProvider from "./components/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '0xPost',
  description: 'Start using a Decentralized web3 substack',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <body className={inter.className}>

      <ToasterProvider />

        <Providers>
        
          <Navbar />

          <Sidebar>{children}</Sidebar>

        </Providers>
      
      
        </body>

    </html>
  );
}

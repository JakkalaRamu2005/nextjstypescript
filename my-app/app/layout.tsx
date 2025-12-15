"use client"
import { usePathname } from "next/navigation";
import "./globals.css"




// ... existing code ...

import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const noNavbarPages = ["/login", "/register", "/forgotpassword", "/reset-password"];

  const showNavbar = !noNavbarPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}

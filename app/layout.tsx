import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

// With shadcn you can define own tailwind css properties and use them normally as tailwind classes via variable -> all this setting can be done here in layout.tsx

const IBMPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "ImageNest",
  description:
    "Leverage Power of AI for Image-Genaration, Image-Enhancement and Image-Attribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
          {children}
        </body>
        {/* antialiased used smoothing fonts */}
      </html>
    </ClerkProvider>
  );
}

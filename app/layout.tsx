import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Doto",
  description: "A modern note-taking app",
  icons: {
    icon: [
      { url: "/dot.png", type: "image/png" },
      { url: "/dot.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/dot.png",
    apple: "/dot.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

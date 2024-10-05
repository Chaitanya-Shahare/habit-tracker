import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "@/components/next-toast-container";
import { Bounce } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Habit Tracker",
  description:
    "Habit Tracker is a web application (PWA) built with Next.js that allows users to track their daily habits. Users can visualize their habit consistency with a heatmap, add, edit, and delete habits, and create an account to save their habits.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  height: "device-height",
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="max-w-md mx-auto min-h-screen relative">
          {" "}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={"colored"}
          transition={Bounce}
        />
      </body>
    </html>
  );
}

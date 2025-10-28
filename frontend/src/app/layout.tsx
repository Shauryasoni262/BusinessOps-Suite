import type { Metadata } from "next";
import "./globals.css";
import { ProjectSocketProvider } from "@/contexts/ProjectSocketContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

export const metadata: Metadata = {
  title: "BusinessOps Suite",
  description: "Comprehensive business operations management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      </head>
      <body>
        <ProjectProvider>
          <ProjectSocketProvider>
            {children}
          </ProjectSocketProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}

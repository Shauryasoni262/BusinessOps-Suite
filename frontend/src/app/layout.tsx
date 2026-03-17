import type { Metadata } from "next";
import "./globals.css";
import "./fonts.css";
import { ProjectSocketProvider } from "@/contexts/ProjectSocketContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import CookieNotice from "@/components/layout/CookieNotice";

export const metadata: Metadata = {
  title: "BusinessOps Suite | All-in-One Platform for Modern Business",
  description: "Manage projects, teams, payments, and AI-powered operations in one powerful, unified platform. Streamline your workflow and boost productivity with BusinessOps Suite.",
  keywords: ["business operations", "project management", "team collaboration", "invoicing", "AI business assistant", "workflow automation", "SaaS", "business productivity"],
  openGraph: {
    title: "BusinessOps Suite | Modern Business Management",
    description: "The complete platform for managing your business operations, from projects to payments.",
    url: "https://businessops-suite.com", // Replace with actual URL when live
    siteName: "BusinessOps Suite",
    images: [
      {
        url: "/og-image.png", // We should create this or use a high-quality placeholder
        width: 1200,
        height: 630,
        alt: "BusinessOps Suite Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BusinessOps Suite | Modern Business Management",
    description: "The complete platform for managing your business operations.",
    images: ["/og-image.png"],
  },
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
      <body suppressHydrationWarning>
        <ProjectProvider>
          <ProjectSocketProvider>
            <AnalyticsProvider>
              {children}
              <CookieNotice />
            </AnalyticsProvider>
          </ProjectSocketProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}

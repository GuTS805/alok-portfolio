import "./globals.css";
import DomainIntro from "./domain-intro";
import { ExperienceProvider } from "./components/experience";
import { site } from "./data/site";
import localFont from "next/font/local";
const display = localFont({
  src: [
    {
      path: "../public/fonts/HTxwL3I-JCGChYJ8VI-L6OO_au7B47b1_3E.woff2",
      weight: "800",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const body = localFont({
  src: [
    {
      path: "../public/fonts/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxhTg.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZthTg.woff2",
      weight: "700",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
const mono = localFont({
  src: [
    {
      path: "../public/fonts/-F63fjptAgt5VM-kVkqdyU8n5ig.woff2",
      weight: "400",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});
const title =
  "Alok Srivastava | Full-Stack Developer & Open-Source Contributor";
const description =
  "Explore the portfolio of Alok Srivastava, a full-stack developer building web applications, blockchain investigation tools, and contributing to open-source software.";
export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Alok Srivastava" },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Alok Srivastava",
    locale: "en_US",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Alok Srivastava — Build Without Limits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social-preview.png"],
  },
  robots: { index: true, follow: true },
};
export const viewport = { themeColor: "#090807" };
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <DomainIntro />
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}

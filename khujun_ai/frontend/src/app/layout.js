import "./globals.css";
import { Asul } from "next/font/google";

const asul = Asul({
  variable: "--font-asul",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Khujun AI",
  description: "Discover points of interest in Dhaka Division with AI-powered summaries and real-time distance calculation.",
  authors: [
    {
      name: "Mohammad Abu Sayem",
      url: "https://www.mdabusayemsarker.com", 
    },
  ],
  keywords: ["Khujun AI", "Dhaka POIs", "Map", "Geolocation", "AI summaries"],
  creator: "Mohammad Abu Sayem",
  publisher: "Khujun AI Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={asul.variable}>
        {children}
      </body>
    </html>
  );
}

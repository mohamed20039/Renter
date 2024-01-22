import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/Components/Header.jsx";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} mt-7 mx-12`}>
        <Header />
        {children}
      </body>
    </html>
  );
}

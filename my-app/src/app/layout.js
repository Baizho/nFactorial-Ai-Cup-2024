import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

import Header from "../components/Header/Header.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <title>DevState</title>
      <body style={{ backgroundColor: "lightblue" }}>
        <Header />
        {children}
      </body>
    </html >
  );
}

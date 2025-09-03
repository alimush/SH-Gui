import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Smart Home",
  description: "Smart Home App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-wite text-black bg-gray-100">
        {/* 🔹 الهيدر */}
        <Header />

        {/* 🔹 المحتوى الأساسي */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}

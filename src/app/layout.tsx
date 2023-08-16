import Login from "./components/login";
import "./globals.css";
import { cookies } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loginFunction = async (user: string) => {
    "use server";
    cookies().set("login", user);
    return true;
  };
  const login = cookies().get("login");
  return (
    <html lang="en">
      <body>{login ? children : <Login setLogin={loginFunction} />}</body>
    </html>
  );
}

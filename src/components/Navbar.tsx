"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const { setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex justify-between items-center p-4 bg-background container mx-auto">
      <Link href="/">
        <h1 className="text-2xl font-bold">Mystry Message</h1>
      </Link>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleToggleTheme}>
          <SunMoon />
        </Button>

        {user ? (
          <>
            <span>Welcome, {user.username || user.email}</span>

            <Button variant={"secondary"}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>

            <Button onClick={() => signOut()}>Sign Out</Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

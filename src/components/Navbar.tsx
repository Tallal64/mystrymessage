"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <div className="flex justify-between items-center p-4 bg-background text-white container mx-auto">
      <Link href="/">
        <h1 className="text-2xl font-bold text-black">Mystry Message</h1>
      </Link>

      <div>
        {user ? (
          <>
            <span>Welcome, {user.username || user.email}</span>
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

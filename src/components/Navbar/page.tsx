import { Button } from "../ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 
import { SignOutButton } from "@/components/ui/SignOutButton";

export const Navbar= async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="fixed z-100 top-0 left-0 bg-black pl-42 w-screen h-20 p-8 flex items-center gap-72">
      <div className="flex gap-2 items-center">
        <img src="/2.png" alt="logo" />
        <h1 className="text-white text-md font-sans">EchoSpace</h1>
      </div>

      <div className="flex gap-8 justify-center border bg-black shadow-xs w-96 h-8 items-center rounded-md font-light">
        <Link className="text-[#ADADAD]" href="/">Home</Link>
        <Link className="text-[#ADADAD]" href="/session">Sessions</Link>
        <Link className="text-[#ADADAD]" href="/feedback">Feedback</Link>
        <Link className="text-[#ADADAD]" href="/ideas">Ideas</Link>
      </div>

      <div className="flex ">
        {session?.user ? (
          <div className="flex items-center gap-4">
            <img
              src={session.user.image ?? "/default-avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <p className="text-white text-sm">{session.user.name}</p>
              <SignOutButton />
          </div>
        ) : (
          <Button className="bg-white ml-36">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export function SignOutButton() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
          Sign out
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className=" text-white border border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out ?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out of EchoSpace?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className=""
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Yes, Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

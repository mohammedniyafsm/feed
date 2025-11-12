"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { bricolage_grotesque } from "@/lib/fonts";

export default function SignIn() {
    return (
        <div className="min-h-screen flex flex-col pt-40 items-center bg-black">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl text-center space-y-6"
            >
                <h1 className={`text-5xl font-bold  text-foreground ${bricolage_grotesque} font-extrabold `}>
                    Welcome Back to EchoSpace
                </h1>

                <p className="text-white font-inter leading-relaxed text-sm">
                    Join the conversation where every voice shapes a better future.        </p>

                <div className="pt-6 flex justify-center ">
                    <Button
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="flex items-center gap-2 px-2 py-3 rounded-xl text-lg font-medium "
                    >
                        <Github size={20} />
                        Sign in with GitHub
                    </Button>
                </div>

                <p className="text-sm text-gray-500 pt-4">
                    By continuing, you agree to our Terms & Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}

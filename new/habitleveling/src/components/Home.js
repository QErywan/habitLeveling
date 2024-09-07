"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


const HomeStuff = () => {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }
    , [session]);

    return (


        <>
        <div className="bg-base-100">
            <button className="m-5 p-3 rounded-lg bg-neutral">
            <a href="/signin">Sign In</a>
            </button>
        </div>
        </>
    )
}

export default HomeStuff;
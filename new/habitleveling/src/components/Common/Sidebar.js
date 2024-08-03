"use client"

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Sidebar = () => {
    const router = useRouter();

    const handleItemClick = (item) => async () => {
        switch (item) {
            case "status":
                router.push("/dashboard/status");
                break;
            case "habit":
                router.push("/dashboard/habit");
                break;
            case "quest":
                router.push("/dashboard/quest");
                break;
            case "logout":
                await signOut({ callbackUrl: '/' });
                break;
            default:
                console.log("default");
                break;
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button className="btn btn-outline btn-sm" onClick={handleItemClick('habit')}>HABIT</button>
            <button className="btn btn-outline btn-sm" onClick={handleItemClick('status')}>STATUS</button>
            <button className="btn btn-outline btn-sm" onClick={handleItemClick('logout')}>LOGOUT</button>
        </div>
    );
}

export default Sidebar;
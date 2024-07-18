import { signOut } from "@/lib/firebase/auth"
import { useRouter } from "next/router";


export default function Dashboard(user) {

    const router = useRouter();


    const handleSignOut = () => {
        signOut();
        router.push('/login');
    }

    // Can do something like:
    // If UID exist show them the normal stuff, else show nothing
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}
"use client";

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Loader from "@/components/Common/Loader"
import { signIn } from "next-auth/react"

const SignUp = () => {
    const router = useRouter();
    const [isPassword, setIsPassword] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const loginUserGoogle = async () => {
        const response = await signIn('google', {
            redirect: false,
            callbackUrl: '/dashboard',
        })
        .then((callback) => {
            if (callback.error) {
                console.log(callback.error);
                return;
            }
            console.log(callback);

            if (callback.ok && !callback.error) {
                router.push('/dashboard');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                router.push("/signin");
            } else {
                setIsLoading(false);
                console.error('Registration failed:', data.message);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
        } 
    };

    return (
        <section className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <Image src="" alt="Logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold text-gray-800">Habit Leveling</h1>
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={loginUserGoogle}
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
                    >
                        Sign Up with Google
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type={isPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setIsPassword(!isPassword)}
                            className="text-sm text-gray-600 hover:text-gray-500"
                        >
                            {isPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
                        >
                            {loading ? <Loader /> : "Sign Up"}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-blue-500">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    )
};



export default SignUp;
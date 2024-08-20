"use client"

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '@/components/Common/Loader';


const SignIn = () => {
    const router = useRouter();

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [isPassword, setIsPassword] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const loginUserGoogle = async () => {
        const response = await signIn('google', {
            callbackUrl: '/dashboard/habit',
        })
    }

    const delay = 1000;

    useEffect(() => {
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, []);



    const loginUserCredentials = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const response = await signIn('credentials', {
            redirect: false,
            email: loginData.email,
            password: loginData.password,
        })
        .then((callback) => {
            if (callback.error) {
                console.log(callback.error);
                setIsLoading(false);
                return;
            }
            console.log(callback);

            if (callback.ok && !callback.error) {
                router.push('/dashboard');
            }
        })
        .catch((error) => {
            setIsLoading(false);
            console.log(error);
        });
        
    }

    if (pageLoading) {
        return (
            <div className="bg-neutral text-white p-6 min-h-screen">
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white mb-2"></div>
                    <p>Getting login form</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-base-100 px-5">
            <div className="w-full max-w-md p-4 bg-neutral rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <Image src="" alt="Logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold text-neutral-content">Habit Leveling</h1>
                </div>
                <div className="mt-4">
                    <button
                        onClick={loginUserGoogle}
                        className="w-full px-3 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none"
                    >
                        Sign In with Google
                    </button>
                </div>
                {/* <form onSubmit={loginUserCredentials} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-content">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="w-full px-3 py-2 mt-1 text-neutral-content rounded-md border border-neutral-content focus:outline-none"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-content">Password</label>
                        <div className="relative">
                            <input
                                type={isPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full px-3 py-2 mt-1 text-neutral-content border border-neutral-content rounded-md focus:outline-none "
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsPassword(!isPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 focus:outline-none"
                            >
                                {isPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.707 4.293a2 2 0 010 2.828L6.414 19.121a2 2 0 01-2.828-2.828L16.88 1.464a2 2 0 012.828 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12a5 5 0 1010 0 5 5 0 00-10 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-3 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        {loading ? <Loader /> : 'Sign In'}
                    </button>
                    <div className="mt-4 text-center">
                        <Link href="/auth/forgot-password" className='text-sm text-blue-500'>
                            Forgot Password?
                        </Link>
                    </div>
                    <div>
                        <p className="mt-4 text-center text-sm text-neutral-content">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-500">Sign Up</Link>
                        </p>
                    </div>
                </form> */}
            </div>
        </div>
    );
}    

export default SignIn;


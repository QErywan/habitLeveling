// Login page using firebase

import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation";

import { signInWithGoogle } from '@/lib/firebase/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // const provider = new GoogleAuthProvider();
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    }

    const handleGoogleLogin = async () => {
        const userCredential = await signInWithGoogle();
        console.log(userCredential);
        const user = userCredential.user;
        // need to figure out passing details(UID) to dashboard
        router.push('/dashboard', { user });
    };
    const handleEmailLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            // navigate to dashboard with user data
            router.push('/dashboard', { user });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            setError(true);

            switch (errorCode) {
                case 'auth/user-not-found':
                    setErrorMessage('User not found');
                    break;
                case 'auth/wrong-password':
                    setErrorMessage('Wrong password');
                    break;
                case 'auth/invalid-credential':
                    setErrorMessage('Wrong email or password entered');
                    break;
                default:
                    setErrorMessage(errorMessage);
                    break;
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleEmailLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    name='email'
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    name='password'
                    value={password}
                />
                <button type="submit">Login</button>
            </form>
            <p>
                <button onClick={handleGoogleLogin}>Login with Google</button>
            </p>
            <Link href="/signup">
                Don't have an account? Sign up
            </Link>
            {error && <p>{errorMessage}</p>}
        </div>
    );
}
// sign up page
import React, { useState } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithGoogle } from '@/lib/firebase/auth';
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    }

    const handleGoogleSignUp = async () => {
        const userCredential = await signInWithGoogle();
        router.push('/dashboard');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');

            // navigate to dashboard with user data
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            setError(true);
            console.log(errorCode);
            console.log(errorMessage);

            switch (errorCode) {
                case 'auth/email-already-in-use':
                    setErrorMessage('Email already in use');
                    break;
                case 'auth/invalid-email':
                    setErrorMessage('Invalid email');
                    break;
                case 'auth/weak-password':
                    setErrorMessage('Password is too weak');
                    break;
                default:
                    setErrorMessage('Something went wrong');
                    break;
            }
        }
    };
    
    return (
        <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
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
            <button type="submit">Sign Up</button>
        </form>
        <p>
            <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
        </p>
        {error && <p>{error}</p>}
        <p>
            Already have an account? <Link href="/login">Log In</Link>
        </p>
        </div>
    );
}
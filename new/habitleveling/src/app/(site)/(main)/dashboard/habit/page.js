"use client"

import DashboardHabit from "@/components/Dashboard/Habit";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DashboardHabitPage() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('/api/getUserData');
                    if (response.ok) {
                        const data = await response.json();
                        if (data) {
                            setUserData(data);
                            localStorage.setItem('userData', JSON.stringify(data));
                        } else {
                            router.push('/create');
                        }
                    } else if (response.status === 429) {
                        toast.error('Too many requests. Using cached data.');
                        const cachedUserData = localStorage.getItem('userData');
                        if (cachedUserData) {
                            setUserData(JSON.parse(cachedUserData));
                        } else {
                            toast.error('No cached data available.');
                        }
                    } else {
                        throw new Error('Failed to fetch user data: ' + response.statusText);
                    }
                } catch (error) {
                    toast.error('Error fetching user data: ' + error.message);
                    const cachedUserData = localStorage.getItem('userData');
                    if (cachedUserData) {
                        setUserData(JSON.parse(cachedUserData));
                    } else {
                        toast.error('No cached data available.');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        } else if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (loading) {
        return <Loader />;
    }

    if (!userData) {
        return null;
    }

    return (
        <>
            <ToastContainer />
            <DashboardHabit userData={userData} />
        </>
    );
}

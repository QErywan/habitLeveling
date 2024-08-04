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
    const delay = 1000;
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, delay);
        return () => clearTimeout(timer);
    }, []);

    console.log(userData);

    
    if (loading || !userData) {
        return (
            <div className="bg-blue-950 text-white p-6 min-h-screen">
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white mb-2"></div>
                    <p>Loading Habits</p>
                </div>
            </div>
        );
    }
    
    // hasAccess authentication. To add free trial logic
    if (!userData.hasAccess && !userData.freeTrial) {
        router.push('/pricing');
    }

    return (
        <>
            <ToastContainer />
            <DashboardHabit userData={userData} />
        </>
    );
}

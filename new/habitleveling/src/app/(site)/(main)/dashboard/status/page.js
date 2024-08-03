"use client"

import DashboardStatus from "@/components/Dashboard/Status";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';
import { ToastContainer, toast } from "react-toastify";


export default function DashboardStatusPage() {

    const { data: session, status } = useSession();
    // console.log(session, status);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rateLimited, setRateLimited] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchUserData = async () => {
                try {
                    const response = await fetch('/api/getUserData');
                    if(response.ok) {
                        const data = await response.json();
        
                        if (data) {
                            setUserData(data);
                            localStorage.setItem('userData', JSON.stringify(data));
                        } else {
                            router.push('/create');
                        }
                    } else if (response.status === 429) {
                        toast.error('Too many requests. Please try again later.');
                        const cachedUserData = localStorage.getItem('userData');
                        if (cachedUserData) {
                            setUserData(JSON.parse(cachedUserData));
                        } else {
                            setRateLimited(true);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    const cachedUserData = localStorage.getItem('userData');
                        if (cachedUserData) {
                            setUserData(JSON.parse(cachedUserData));
                        } else {
                            setRateLimited(true);
                        }
                } finally {
                    setLoading(false);
                }
            }
            fetchUserData();
        } else if(status === 'unauthenticated'){
            router.push('/signin');
        }
    }, [status, router]);

    if (loading) {
        return <Loader />
    }

    if (rateLimited) {
        return <ToastContainer />
    }

    if (!userData) {
        return null;
    }

    return (
        <>
            <ToastContainer />
            <DashboardStatus userData={userData} />;
        </>
    ) 
}
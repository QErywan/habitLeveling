"use client"

import DashboardStatus from "@/components/Dashboard/Status";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';


export default function DashboardPage() {

    const { data: session, status } = useSession();
    // console.log(session, status);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    console.log(status, 'status');

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUserData();
        } else if(status === 'unauthenticated'){
            router.push('/signin');
        }
    }, [status]);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/getUserData');
            if(response.ok) {
                const data = await response.json();

                if (data) {
                    setUserData(data);
                } else {
                    router.push('/create');
                }
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader />
    }

    if (!userData) {
        return null;
    }

    console.log(userData, 'userData');
    return <DashboardStatus userData={userData} />;
}
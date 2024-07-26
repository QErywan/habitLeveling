"use client"

import Dashboard from '@/components/Dashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';


function DashboardPage() {
    const { data: session, status } = useSession();
    // console.log(session, status);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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



    return (
        <Dashboard  userData={userData}/>
    );
}

export default DashboardPage;
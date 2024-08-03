"use client"

import Dashboard from '@/components/Dashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '@/components/Common/Loader';


function DashboardPage() {
    const router = useRouter();
    useEffect(() => {
        router.push('/dashboard/habit');
    }, [router]);
}

export default DashboardPage;
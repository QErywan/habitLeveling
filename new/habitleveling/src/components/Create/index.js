"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Loader from '@/components/Common/Loader';

const Create = () => {
    const router = useRouter();
    const [loading, setIsLoading] = useState(false);
    const [chosenClass, setChosenClass] = useState('');
    const [username, setUsername] = useState('');
    // i want to check if there exist a UserData entry when they enter this page, if there is, redirect to dashboard
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkData = async () => {
            if (status === 'authenticated') {
                try {
                    const response = await fetch('/api/checkUserData', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    if (data.error) {
                        console.log(data.error);
                        return;
                    }
                    if (data) {
                        router.push('/dashboard');
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        checkData();
    }, [status, router]);

    if (status === 'loading') {
        return <Loader />;
    }

    const handleSubmit = (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            const finalData = {
                username,
                userClass: chosenClass,
            };

            fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            })
                .then((res) => res.json())
                .then((data) => {
                    setIsLoading(false);
                    console.log(data);
                    if (data.error) {
                        console.log(data.error);
                        return;
                    }
                    router.push('/dashboard');
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
        
    };

    return (
        // multiple divs (1. class selection, 2. username input, 3. submit button), class selection should be 4 buttons that you can only select 1 and username will be a text box
        <section className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <Image src="" alt="Logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold text-gray-800">Habit Leveling</h1>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
                        <div className="flex flex-row">
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950 ${
                                    chosenClass === 'warrior' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('warrior')}
                            >
                                Warrior
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950 ${
                                    chosenClass === 'mage' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('mage')}
                            >
                                Mage
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950 ${
                                    chosenClass === 'ranger' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('ranger')}
                            >
                                Ranger
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950 ${
                                    chosenClass === 'rogue' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('rogue')}
                            >
                                Rogue
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-stone-950"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
                        >
                            {loading ? <Loader /> : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Create;
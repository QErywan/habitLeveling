"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Loader from '@/components/Common/Loader';

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
    const router = useRouter();
    const [loading, setIsLoading] = useState(true);
    const [chosenClass, setChosenClass] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // i want to check if there exist a UserData entry when they enter this page, if there is, redirect to dashboard
    const { data: session, status } = useSession();

    const delay = 1000;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(timer);
    }, []);



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
                    if (response === 429) {
                        toast('Too many requests!');
                    }

                    const data = await response.json();
                    if (data) {
                        router.push('/dashboard/habit');
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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            const finalData = {
                username,
                userClass: chosenClass,
            };

            const response = await fetch('/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            })

            if (response.status === 429) {
                toast('Too many requests!');
            }

            const data = await response.json();
            setIsLoading(false);


            if (data.error) {
                setErrorMessage(data.error);
            } else {
                router.push('/dashboard/habit');
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Error creating user');
            console.error(error);
        }
        
    };

    return (
        // multiple divs (1. class selection, 2. username input, 3. submit button), class selection should be 4 buttons that you can only select 1 and username will be a text box
        <section className="flex items-center justify-center h-screen bg-blue-950 p-5">
            <div className="w-full max-w-md p-4 bg-indigo-900 rounded-lg shadow-lg">
                <div className="flex items-center justify-center">
                    <Image src="" alt="Logo" width={50} height={50} />
                    <h1 className="text-3xl font-bold text-white">Habit Leveling</h1>
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                        <label htmlFor="class" className="block text-sm font-medium text-white">Class</label>
                        <div className="flex flex-row">
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-white ${
                                    chosenClass === 'warrior' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('warrior')}
                            >
                                Warrior
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-white ${
                                    chosenClass === 'mage' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('mage')}
                            >
                                Mage
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-white ${
                                    chosenClass === 'ranger' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('ranger')}
                            >
                                Ranger
                            </button>
                            <button
                                type="button"
                                className={`w-1/4 px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md text-white ${
                                    chosenClass === 'rogue' ? 'bg-blue-500 text-white' : ''
                                }`}
                                onClick={() => setChosenClass('rogue')}
                            >
                                Rogue
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:border focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
                            placeholder="Username"
                            required
                        />
                        {errorMessage && <div class="show_info text-sm mb-4 w-max text-red-400">Username already taken</div>}
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {loading ? <Loader /> : "Create"}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </section>
    );
};

export default Create;
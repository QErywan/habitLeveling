"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HabitForm = () => {
    const [habit, setHabit] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/createHabit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    habit,
                }),
            });
            console.log(response);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                router.push('/dashboard');
            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div>
        //     <form onSubmit={handleSubmit}>
        //         <input
        //             type="text"
        //             placeholder="Habit"
        //             value={habit}
        //             onChange={(e) => setHabit(e.target.value)}
        //             className='text-stone-950'
        //         />
        //         <button type="submit" disabled={loading}>
        //             {loading ? 'Loading...' : 'Create Habit'}
        //         </button>
        //     </form>
        // </div>

        <div className='bg-base-100 text-white p-6 min-h-screen'>

            <div className='flex flex-auto justify-center w-ful'>
                <div className='flex-col card bg-neutral gap-0 items-center w-full'>

                    {/* Title */}
                    <div className="flex py-2 m-2">
                        <div className='flex py-2 px-3 border text-center rounded-md'>
                            <h1 className="text-4xl font-extrabold bg-clip-text">ADD NEW HABIT</h1>
                        </div>
                    </div>


                    {/* Content */}
                    <div className='flex flex-col gap-3 flex-initial w-full items-center'>

                        <form onSubmit={handleSubmit} className='form flex-col items-center space-y-5 my-5 w-full px-5'>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Habit"
                                    value={habit}
                                    onChange={(e) => setHabit(e.target.value)}
                                    className='border border-neutral-content text-netural-content text-md rounded-lg focus:ring-white focus:border focus:border-white block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center'
                                />
                            </div>
                            <button 
                                className='text-white bg-base-200 hover:bg-base-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:focus:ring-blue-800'
                                type="submit" 
                                disabled={loading}>
                                    {/* <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> */}
                                {loading ? 'Loading...' : 'Create Habit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HabitForm;
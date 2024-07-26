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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Habit"
                    value={habit}
                    onChange={(e) => setHabit(e.target.value)}
                    className='text-stone-950'
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Create Habit'}
                </button>
            </form>
        </div>
    );
}

export default HabitForm;
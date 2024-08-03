
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const DashboardHabit = ({ userData }) => {
    const delay = 1000;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, delay);
        return () => clearTimeout(timer);
    }
    , []);
    


    if (!userData) {
        return (
            <div className="bg-blue-950 text-white p-6 min-h-screen">
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white"></div>
                    <p>Loading user data...</p>
                </div>
            </div>
        );
    }

    const router = useRouter();
    const [habits, setHabits] = useState(userData.HabitList);


    const handleCompleteHabit = async (habitId, isChecked) => {
        // Update local state immediately
        setHabits(prevHabits => 
            prevHabits.map(habit => 
                habit._id === habitId ? { ...habit, CompletedToday: isChecked } : habit
            )
        );
    
        // API call
        const response = await fetch("/api/completeHabit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ habitId, status: isChecked }),
        });
    
        if (!response.ok) {
            console.log("Error completing habit");
            // Revert the state if API call fails
            setHabits(prevHabits => 
                prevHabits.map(habit => 
                    habit._id === habitId ? { ...habit, CompletedToday: !isChecked } : habit
                )
            );
        }
    }

    const addHabit = () => {
        console.log('Add Habit');

        router.push('/newHabit');

    }

    const handleItemClick = (item) => async () => {
        switch (item) {
            case "status":
                router.push("/dashboard/status");
                break;
            case "habit":
                router.push("/dashboard/habit");
                break;
            case "quest":
                router.push("/dashboard/quest");
                break;
            case "logout":
                await signOut({ callbackUrl: '/' });
                break;
            default:
                console.log("default");
                break;
        }
    }

    if (loading) {
        return (
            <div className="bg-blue-950 text-white p-6 min-h-screen">
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white mb-2"></div>
                    <p>Loading Habits</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-950 text-white p-6 min-h-screen">
            {/* <Sidebar />
            <Habit HabitList={userData.HabitList} />
            <AddHabitButton /> */}

            {/* lg section */}
            <div className="hidden lg:block">
                <div className="flex flex-row gap-4 h-screen max-h-[30rem] ">

                    {/* Sidebar lg */}
                    <div className="hidden lg:flex lg:w-44 card lg:justify-center lg:px-4">
                        <div className='flex flex-col gap-3'>
                            {/* <a href='/dashboard/habit'>HABIT</a>
                            <a href='/dashboard/status'>STATUS</a>
                            <a href='/dashboard/habit'>HABIT</a> */}
                            <button className="btn btn-outline btn-md btn-active border-white text-white" onClick={handleItemClick('habit')}>HABIT</button>
                            <button className="btn btn-outline btn-md border-white text-white" onClick={handleItemClick('status')}>STATUS</button>
                            <button className="btn btn-outline btn-md border-white text-white" onClick={handleItemClick('logout')}>LOGOUT</button>
                        </div>
                    </div>

                    {/* Habit lg */}
                    <div className="hidden lg:max-w-[92rem] lg:mx-auto lg:flex">
                        <div className="flex flex-col card bg-indigo-700 gap-0">

                            {/* Title */}
                            <div className="py-2 flex flex-row p-4">
                                <div className='mx-96 py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">HABIT</h1>
                                </div>
                                <button
                                    onClick={addHabit}
                                    className="w-10 h-10 bg-indigo-800 rounded-md text-white text-4xl text-center mt-3 hover:bg-indigo-900 border boder-white"
                                >
                                    +
                                </button>
                            </div>


                            {/* Content */}
                            <div className="grid grid-cols-2 gap-5 overflow-auto px-5 py-2">

                                {/* Habit List */}
                                {habits && habits.length > 0 ? ((habits.map((habit) => (
                                    <div className="flex flex-row card bg-indigo-800 px-2 h-20 border border-white">
                                        <label className="flex items-center justify-between h-full w-full">
                                            <span className="ml-2">{habit.Name}</span>
                                            <input
                                                type="checkbox"
                                                className="form-checkbox checkbox checkbox-lg checkbox-primary"
                                                onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
                                                checked={habit.CompletedToday}
                                            />
                                        </label>
                                    </div>
                                ))) ) : (
                                    <p>Add habit with the button above!</p>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            {/* sm/md section */}
            <div className='lg:hidden block'>
                <div className="flex flex-col lg:flex-row lg:gap-4 lg:mt-4">
                    {/* Sidebar sm/md */}
                    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pb-[calc(max(env(safe-area-inset-bottom),16px)-16px)] bg-indigo-700 border-t border-base-content/10 select-none">
                        <div className="flex justify-between">
                            <button className="btn btn-ghost" onClick={handleItemClick('habit')}>HABIT</button>
                            <button className="btn btn-ghost" onClick={handleItemClick('status')}>STATUS</button>
                            <button className="btn btn-ghost" onClick={handleItemClick('logout')}>LOGOUT</button>
                        </div>
                    </div>

                    {/* Stats Area sm/md */}

                    <div className='lg:hidden flex-auto'>
                        <div className='flex-col card bg-indigo-700 gap-0 items-center'>

                            {/* Title */}
                            <div className="flex py-2 ">
                                <div className='flex py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">HABIT</h1>
                                </div>
                            </div>


                            {/* Content */}
                            <div className='flex flex-col gap-3 flex-initial w-full'>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-auto px-5 py-2 max-h-[25rem] w-full">

                                    {/* Habit List */}
                                    {habits && habits.length > 0 ? ((habits.map((habit) => (
                                        <div className="flex flex-row card bg-indigo-800 border border-white px-2 h-20">
                                            <label className="flex items-center justify-between w-full">
                                                <span className="ml-2">{habit.Name}</span>
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox checkbox checkbox-lg checkbox-primary"
                                                    onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
                                                    checked={habit.CompletedToday}
                                                />
                                            </label>
                                        </div>
                                    ))) ) : (
                                        <p>Add habit with the button above!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-col card bg-indigo-700 gap-0 items-center my-2">
                            <button
                                onClick={addHabit}
                                className="h-10 w-full hover:bg-indigo-900  rounded-lg text-white text-xl text-center"
                            >
                                Add Habit
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHabit;
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardSkeleton from "./HabitSkeleton";

const DashboardHabit = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/getUserData");
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setUserData(data);
                        setHabits(data.HabitList);
                    } else {
                        router.push("/create");
                    }

                    if (!data.hasAccess && !data.freeTrial) {
                        router.push("/pricing");
                    }
                    localStorage.setItem("userData", JSON.stringify(data));
                } else if (response.status === 429) {
                    handleRateLimit();
                } else {
                    throw new Error(`Failed to fetch user data: ${response.statusText}`);
                }
            } catch (error) {
                handleFetchError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleRateLimit = () => {
            toast.error("Too many requests. Using cached data.");
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
                const parsedData = JSON.parse(cachedUserData);
                setUserData(parsedData);
                setHabits(parsedData.HabitList);
            } else {
                toast.error("No cached data available.");
            }
        };

        const handleFetchError = (error) => {
            toast.error(`Error fetching user data: ${error.message}`);
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
                const parsedData = JSON.parse(cachedUserData);
                setUserData(parsedData);
                setHabits(parsedData.HabitList);
            } else {
                toast.error("No cached data available.");
            }
        };

        if (status === "authenticated") {
            fetchUserData();
        } else if (status === "unauthenticated") {
            router.push("/signin");
        }
    }, [status, router]);

    const handleDeleteHabit = async (habitId) => {
        const updatedHabits = habits.filter((habit) => habit._id !== habitId);
        setHabits(updatedHabits);

        try {
            const response = await fetch("/api/deleteHabit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ habitId }),
            });

            if (response.status === 429) {
                toast.error("Too many requests.");
            } else if (!response.ok) {
                throw new Error("Failed to delete habit");
            }
        } catch (error) {
            console.log(error.message);
            setHabits((prevHabits) => [...prevHabits, ...updatedHabits]);
        }
    };

    const handleCompleteHabit = async (habitId, isChecked) => {
        const updatedHabits = habits.map((habit) =>
            habit._id === habitId ? { ...habit, CompletedToday: isChecked } : habit
        );
        setHabits(updatedHabits);

        try {
            const response = await fetch("/api/completeHabit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ habitId, status: isChecked }),
            });

            if (response.status === 429) {
                toast.error("Too many requests.");
            } else if (!response.ok) {
                throw new Error("Failed to update habit");
            }
        } catch (error) {
            console.log(error.message);
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit._id === habitId ? { ...habit, CompletedToday: !isChecked } : habit
                )
            );
        }
    };

    const toggleDropdown = (id) => {
        setHabits((prevHabits) =>
            prevHabits.map((habit) =>
                habit._id === id
                    ? { ...habit, showDropdown: !habit.showDropdown }
                    : { ...habit, showDropdown: false }
            )
        );
    };

    const addHabit = () => {
        router.push("/newHabit");
    };

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
                await signOut({ callbackUrl: "/" });
                break;
            default:
                console.log("default");
                break;
        }
    };

    if (loading || !userData) {
        <DashboardSkeleton />
    }

return (
        <div className="bg-base-100 text-white p-6 min-h-screen">
            {/* <Sidebar />
            <Habit HabitList={userData.HabitList} />
            <AddHabitButton /> */}

            {/* lg section */}
            <div className="hidden lg:flex">
                    {/* Sidebar lg */}
                    <div className="hidden lg:flex lg:w-44 card lg:justify-center lg:px-4 lg:static">
                        <div className='flex flex-col gap-3 static'>
                            {/* <a href='/dashboard/habit'>HABIT</a>
                            <a href='/dashboard/status'>STATUS</a>
                            <a href='/dashboard/habit'>HABIT</a> */}
                            <button className="btn btn-outline btn-md btn-active border-white text-white" onClick={handleItemClick('habit')}>HABIT</button>
                            <button className="btn btn-outline btn-md border-white text-white" onClick={handleItemClick('status')}>STATUS</button>
                            <button className="btn btn-outline btn-md border-white text-white" onClick={handleItemClick('logout')}>LOGOUT</button>
                        </div>
                    </div>
                <div className="flex flex-row gap-4 h-screen max-h-[30rem] mx-auto ">
                    {/* Habit lg */}
                    <div className="hidden lg:max-w-[92rem] lg:mx-auto lg:flex">
                        <div className="flex flex-col card bg-neutral gap-0">

                            {/* Title */}
                            <div className="py-2 flex flex-row p-4">
                                <div className='mx-96 py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">HABIT</h1>
                                </div>
                                <button
                                    onClick={addHabit}
                                    className="w-10 h-10 bg-neutral rounded-md text-white text-4xl text-center mt-3 hover:bg-indigo-900 border boder-white"
                                >
                                    +
                                </button>
                            </div>


                            {/* Content */}
                            <div className="grid grid-cols-2 gap-5 overflow-y-scroll px-5 py-2">

                                {/* Habit List */}
                                {habits && habits.length > 0 ? ((habits.map((habit) => (
                                    <div className="flex flex-row card bg-base-200 px-2 h-20 border border-white" key={habit._id}>
                                        <div className="flex">
                                            <button
                                                className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl w-5"
                                                onClick={() => toggleDropdown(habit._id)}
                                            >
                                                &#x22EE;
                                            </button>
                                            {/* Dropdown Menu */}
                                            {habit.showDropdown && (
                                                <div className="absolute left-0 top-12 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                                    <ul>
                                                        <li
                                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                                                            onClick={() => handleDeleteHabit(habit._id)}
                                                        >
                                                            Delete Habit
                                                        </li>
                                                        {/* Add more options here if needed */}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <label className="flex items-center justify-between h-full w-full">
                                            <span className="ml-2">{habit.Name}</span>
                                            <input
                                                type="checkbox"
                                                className="form-checkbox checkbox checkbox-lg checkbox-neutral-content border-neutral-content"
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
                    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 pb-[calc(max(env(safe-area-inset-bottom),16px)-16px)] bg-neutral border-t border-base-content/10 select-none">
                        <div className="flex justify-between">
                            <button className="btn btn-ghost" onClick={handleItemClick('habit')}>HABIT</button>
                            <button className="btn btn-ghost" onClick={handleItemClick('status')}>STATUS</button>
                            <button className="btn btn-ghost" onClick={handleItemClick('logout')}>LOGOUT</button>
                        </div>
                    </div>

                    {/* Stats Area sm/md */}

                    <div className='lg:hidden flex-auto'>
                        <div className='flex-col card bg-neutral gap-0 items-center'>

                            {/* Title */}
                            <div className="flex py-2 ">
                                <div className='flex py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">HABIT</h1>
                                </div>
                            </div>


                            {/* Content */}
                            <div className='flex flex-col gap-3 flex-initial w-full'>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-scroll px-5 py-2 max-h-[25rem] w-full">

                                    {/* Habit List */}
                                    {habits && habits.length > 0 ? ((habits.map((habit) => (
                                        <div className="flex flex-row card bg-base-200 border border-white px-2 h-20" key={habit._id}>
                                            <div className="flex text-xl">
                                                <button
                                                    className="text-gray-500 hover:text-gray-700 focus:outline-none w-5"
                                                    onClick={() => toggleDropdown(habit._id)}
                                                >
                                                    &#x22EE;
                                                </button>
                                                {/* Dropdown Menu */}
                                                {habit.showDropdown && (
                                                    <div className="absolute left-0 top-12 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                                        <ul>
                                                            <li
                                                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                                                                onClick={() => handleDeleteHabit(habit._id)}
                                                            >
                                                                Delete Habit
                                                            </li>
                                                            {/* Add more options here if needed */}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="flex items-center justify-between w-full">
                                                <span className="ml-2">{habit.Name}</span>
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox checkbox checkbox-lg checkbox-neutral-content border-neutral-content"
                                                    onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
                                                    checked={habit.CompletedToday}
                                                />
                                            </label>
                                        </div>
                                    ))) ) : (
                                        <p>Add habit with the button below!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-col card bg-neutral gap-0 items-center my-2">
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
        </div>
    );

}

export default DashboardHabit;
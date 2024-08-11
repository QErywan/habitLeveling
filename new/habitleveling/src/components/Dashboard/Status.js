import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const DashboardStatus = ({ userData }) => {

    console.log(userData, 'userData');
    const [availablePoints, setAvailablePoints] = useState(userData.Points);
    const [stats, setStats] = useState(userData?.Stats[0] || {});
    const router = useRouter();

    const delay = 1000;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, delay);
        return () => clearTimeout(timer);
    }
    , []);

    const fullStatName = {
        'STR': 'STRENGTH',
        'AGI': 'AGILITY',
        'VIT': 'VITALITY',
        'INT': 'INTELLIGENCE',
        'FAI': 'FAITH',
        'LUK': 'LUCK',
    }

    // might need to readd fontawesome copyright
    const statIcon = {
        'STR': <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M96 64c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 160 0 64 0 160c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64-32 0c-17.7 0-32-14.3-32-32l0-64c-17.7 0-32-14.3-32-32s14.3-32 32-32l0-64c0-17.7 14.3-32 32-32l32 0 0-64zm448 0l0 64 32 0c17.7 0 32 14.3 32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 64c0 17.7-14.3 32-32 32l-32 0 0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-160 0-64 0-160c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32zM416 224l0 64-192 0 0-64 192 0z"/></svg>,
        'AGI': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288l21.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-21.3 0c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352L32 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l69.6 0c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z"/></svg>,
        'VIT': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>,
        'INT': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>,
        'FAI': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M351.2 4.8c3.2-2 6.6-3.3 10-4.1c4.7-1 9.6-.9 14.1 .1c7.7 1.8 14.8 6.5 19.4 13.6L514.6 194.2c8.8 13.1 13.4 28.6 13.4 44.4l0 73.5c0 6.9 4.4 13 10.9 15.2l79.2 26.4C631.2 358 640 370.2 640 384l0 96c0 9.9-4.6 19.3-12.5 25.4s-18.1 8.1-27.7 5.5L431 465.9c-56-14.9-95-65.7-95-123.7L336 224c0-17.7 14.3-32 32-32s32 14.3 32 32l0 80c0 8.8 7.2 16 16 16s16-7.2 16-16l0-84.9c0-7-1.8-13.8-5.3-19.8L340.3 48.1c-1.7-3-2.9-6.1-3.6-9.3c-1-4.7-1-9.6 .1-14.1c1.9-8 6.8-15.2 14.3-19.9zm-62.4 0c7.5 4.6 12.4 11.9 14.3 19.9c1.1 4.6 1.2 9.4 .1 14.1c-.7 3.2-1.9 6.3-3.6 9.3L213.3 199.3c-3.5 6-5.3 12.9-5.3 19.8l0 84.9c0 8.8 7.2 16 16 16s16-7.2 16-16l0-80c0-17.7 14.3-32 32-32s32 14.3 32 32l0 118.2c0 58-39 108.7-95 123.7l-168.7 45c-9.6 2.6-19.9 .5-27.7-5.5S0 490 0 480l0-96c0-13.8 8.8-26 21.9-30.4l79.2-26.4c6.5-2.2 10.9-8.3 10.9-15.2l0-73.5c0-15.8 4.7-31.2 13.4-44.4L245.2 14.5c4.6-7.1 11.7-11.8 19.4-13.6c4.6-1.1 9.4-1.2 14.1-.1c3.5 .8 6.9 2.1 10 4.1z"/></svg>,
        'LUK': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
    }


    const { Username, JobTitle, Level, Experience } = userData;

    const totalExp = 10 * Level * 1.25;
    const percentage = Math.round((Experience / totalExp) * 100);

    const handleIncrementStat = async (stat) => {
        if (availablePoints > 0) {
            setStats(prevStats => ({
                ...prevStats,
                [stat]: (prevStats[stat] || 0) + 1
            }));
            setAvailablePoints(prevPoints => prevPoints - 1);
            // Here you would also make an API call to update the stats in the backend
            await fetch('/api/updateStatinDatabase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stat,
                    value: stats[stat] + 1,
                }),
            });
        }
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
                await signOut({ callbackUrl: '/' });
                break;
            default:
                console.log("default");
                break;
        }
    }

    if (loading) {
        return (
            <div className="text-white p-6 min-h-screen">
                <div className="flex flex-col justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white"></div>
                    <p>Loading status window</p>
                </div>
            </div>
        );
    }

    return (
        <div className="text-white p-6 min-h-screen mx-auto" data-theme='synthwave'>
            {/* lg section */}
            <div className='hidden lg:flex'>
                    {/* Sidebar lg */}
                    <div className="hidden lg:flex lg:w-44 card lg:justify-center lg:px-4">
                        <div className='flex flex-col gap-3'>
                            {/* <a href='/dashboard/habit'>HABIT</a>
                            <a href='/dashboard/status'>STATUS</a>
                            <a href='/dashboard/habit'>HABIT</a> */}
                            <button className="btn btn-outline btn-md bth-neutral-content" data-theme='synthwave' onClick={handleItemClick('habit')}>HABIT</button>
                            <button className="btn btn-outline btn-md btn-active primbth-neutral-contentary" data-theme='synthwave' onClick={handleItemClick('status')}>STATUS</button>
                            <button className="btn btn-outline btn-md bth-neutral-content" data-theme='synthwave' onClick={handleItemClick('logout')}>LOGOUT</button>
                        </div>
                    </div>
                <div className="flex flex-row gap-4 h-screen max-h-[30rem] mx-auto" data-theme='synthwave'>

                    
                    {/* Stats Area lg */}
                    <div className='hidden lg:max-w-[92rem] lg:mx-auto lg:flex' data-theme='synthwave'>
                        <div className='flex flex-col card gap-0 space-y-8 bg-neutral' data-theme='synthwave'> 

                            {/* Title */}
                            <div className="py-2">
                                <div className='mx-96 py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text text-neutral-content">STATUS</h1>
                                </div>
                            </div>


                            {/* Content */}
                            <div className='grid grid-cols-2 gap-3'>

                                {/* Username and Job Title */}
                                <div className='flex flex-col gap-0 items-center justify-center'>
                                    <h2 className="text-3xl font-extrabold mb-1 py-1">{Username}</h2>
                                    <p className="text-md mb-4 text-neutral-content">
                                        Job Title:
                                        <span className='font-bold uppercase ps-2'>
                                            {JobTitle}
                                        </span>
                                    </p>
                                            
                                </div>
                                
                                {/* Level and Progress bar */}
                                <div className='flex flex-row gap-3 justify-center'>
                                    {/* Level */}
                                    <div className="flex flex-col items-center justify-center gap-0">
                                        <span className="text-4xl font-extrabold">{Level}</span>
                                        <span className="text-sm font-bold">LEVEL</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="flex flex-row items-center gap-2 justify-center ">
                                        <div className="w-48">
                                            <progress className="progress progress-secondary h-3 w-full border-[0.01rem] " value={percentage} max="100"></progress>
                                        </div>
                                        <span className="text-xs">{percentage}%</span>
                                    </div>
                                </div>

                            </div>
                            <div>
                                {/* Stats */}
                                <div className='p-2 mt-10'>
                                    <div className="border border-white px-1 pb-10 rounded-md">
                                        <p className="mb-3">AVAILABLE POINTS: <span className='text-xl font-extrabold'>{availablePoints}</span></p>
                                        <div className="grid grid-cols-2 gap-4 ps-3">
                                            {availablePoints > 0 ? (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                        <p><span>{statIcon[stat]}</span><span className='bold'>{fullStatName[stat]}</span>: <span className='font-bold'>{value}</span></p>
                                                        <button onClick={() => handleIncrementStat(stat)} className="btn btn-outline btn-xs rounded-full border-white text-white hover:bg-white">
                                                            +
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                    <p><span>{statIcon[stat]}</span><span className='bold'>{fullStatName[stat]}</span>: <span className='font-bold'>{value}</span></p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                        <div className='flex-col card bg-neutral gap-5 items-center'>

                            {/* Title */}
                            <div className="flex py-2 ">
                                <div className='flex py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">STATUS</h1>
                                </div>
                            </div>


                            {/* Content */}
                            <div className='flex flex-col gap-5'>

                                {/* Username, Job Title and Level */}
                                <div className='flex flex-row gap-0 items-center justify-center'>

                                    {/* Level */}
                                    <div className="flex flex-col items-center justify-center gap-0">
                                        <span className="text-4xl font-extrabold mb-1 ">{Level}</span>
                                        <span className="text-sm font-bold">LEVEL</span>
                                    </div>

                                    {/* Username and Job Title */}
                                    <div className='ps-10 flex-col'>
                                        <h2 className="text-xl font-extrabold mb-1 py-1">{Username}</h2>
                                        <p className="text-md">
                                            Job Title:
                                            <span className='font-bold uppercase ps-2'>
                                                {JobTitle}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                
                                

                                {/* Progress bar */}
                                <div className="flex flex-row items-center gap-2 justify-center ps-5 ">
                                    <div className="w-48">
                                        <progress className="progress progress-secondary h-3 w-full border-[0.01rem] " value={percentage} max="100"></progress>
                                    </div>
                                    <span className="text-xs">{percentage}%</span>
                                </div>

                                {/* Stats */}
                                <div className='flex-initial w-[24rem] p-2'>
                                    <div className="border border-white px-1 pb-5 rounded-md">
                                        <p className="mb-3">AVAILABLE POINTS: {availablePoints}</p>
                                        <div className="grid grid-cols-2 gap-4 ps-3">
                                            {availablePoints > 0 ? (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                        <p>{statIcon[stat]}<span className='bold'>{stat}</span>: <span className='font-bold'>{value}</span></p>
                                                        <button onClick={() => handleIncrementStat(stat)} className="btn btn-outline btn-xs rounded-full border-white text-white hover:bg-white">
                                                            +
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                    <p>{statIcon[stat]}<span className='bold'>{stat}</span>: <span className='font-bold'>{value}</span></p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardStatus;
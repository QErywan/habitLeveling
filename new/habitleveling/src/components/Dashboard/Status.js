"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

const DashboardStatus = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [availablePoints, setAvailablePoints] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/getUserData");
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            setStats(data.Stats[0]);
            setAvailablePoints(data.Points);

            if (!data.hasAccess && !data.freeTrial) {
              router.push("/pricing");
            }

            localStorage.setItem("userData", JSON.stringify(data));
          } else if (response.status === 429) {
            toast.error("Too many requests. Please try again later.");
            const cachedUserData = localStorage.getItem("userData");
            if (cachedUserData) {
              setUserData(JSON.parse(cachedUserData));
              setStats(JSON.parse(cachedUserData).Stats[0]);
              setAvailablePoints(JSON.parse(cachedUserData).Points);
            } else {
              setRateLimited(true);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          const cachedUserData = localStorage.getItem("userData");
          if (cachedUserData) {
            setUserData(JSON.parse(cachedUserData));
            setStats(JSON.parse(cachedUserData).stats[0]);
            setAvailablePoints(JSON.parse(cachedUserData).Points);
          } else {
            setRateLimited(true);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  const fullStatName = {
    STR: "STRENGTH",
    AGI: "AGILITY",
    VIT: "VITALITY",
    INT: "INTELLIGENCE",
    FAI: "FAITH",
    LUK: "LUCK",
  };

  const handleIncrementStat = async (stat) => {
    if (availablePoints > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [stat]: (prevStats[stat] || 0) + 1,
      }));
      setAvailablePoints((prevPoints) => prevPoints - 1);

      await fetch("/api/updateStatinDatabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        await signOut({ callbackUrl: "/" });
        break;
      default:
        console.log("default");
        break;
    }
  };

  if (loading || !userData) {
    return (
      <div className="text-white p-6 min-h-screen bg-neutral">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white mb-2"></div>
          <p>Loading status window</p>
        </div>
      </div>
    );
  }

  const { Username, JobTitle, Level, Experience } = userData;
  const totalExp = 10 * Level * 1.25;
  const percentage = Math.round((Experience / totalExp) * 100);

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
                                                        <p><span className='bold'>{fullStatName[stat]}</span>: <span className='font-bold'>{value}</span></p>
                                                        <button onClick={() => handleIncrementStat(stat)} className="btn btn-outline btn-xs rounded-full border-white text-white hover:bg-white">
                                                            +
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                    <p><span></span><span className='bold'>{fullStatName[stat]}</span>: <span className='font-bold'>{value}</span></p>
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
                                                        <p><span className='bold'>{stat}</span>: <span className='font-bold'>{value}</span></p>
                                                        <button onClick={() => handleIncrementStat(stat)} className="btn btn-outline btn-xs rounded-full border-white text-white hover:bg-white">
                                                            +
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                Object.entries(stats).map(([stat, value]) => (
                                                    <div key={stat} className="flex justify-between">
                                                    <p><span className='bold'>{stat}</span>: <span className='font-bold'>{value}</span></p>
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
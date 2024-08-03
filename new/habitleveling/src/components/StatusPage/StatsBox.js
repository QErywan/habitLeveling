"use client"

import React, { useState } from 'react';

const StatsBox = ({ userData }) => {

    const [ availablePoints, setAvailablePoints ] = useState(userData.Points);
    const [ stats, setStats ] = useState(userData?.Stats[0] || {});

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

    const fullStatName = {
        'STR': 'STRENGTH',
        'AGI': 'AGILITY',
        'VIT': 'VITALITY',
        'INT': 'INTELLIGENCE',
        'FAI': 'FAITH',
        'LUK': 'LUCK',
    }


    return (
        <div className="border border-white p-4">
            <p className="mb-2">AVAILABLE POINTS: {availablePoints}</p>
            <div className="grid grid-cols-2 gap-4">
            {availablePoints > 0 ? (
                    Object.entries(stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                            <p>{fullStatName[stat]}: {value}</p>
                            <button onClick={() => handleIncrementStat(stat)} className="btn">
                                +
                            </button>
                        </div>
                    ))
                ) : (
                    Object.entries(stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                            <p>{fullStatName[stat]}: {value}</p>
                        </div>
                    ))
            )}
            </div>
        </div>
    );
};

export default StatsBox;
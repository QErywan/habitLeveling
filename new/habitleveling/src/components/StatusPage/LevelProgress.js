import React from 'react';

const LevelProgress = ({ userData }) => {

    const { Level, Experience } = userData;
    const totalExp = 10 * Level * 1.25;
    const percentage = Math.round((Experience / totalExp) * 100);



    return (
        <div className="w-48">
        <progress className="progress progress-secondary w-full" value={percentage} max="100"></progress>
        <span className="text-xs">{percentage}%</span>
        </div>
    );
};

export default LevelProgress;
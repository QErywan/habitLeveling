"use client"

import React, { useState, useEffect } from 'react';

const Habit = ({ HabitList }) => {
    const [habits, setHabits] = useState(HabitList);


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
    console.log(HabitList);

    return (
        <div>
            <h1>Habit Leveling</h1>
            <h2>Habits</h2>
            {habits && habits.length > 0 ? (
                <ul>
                    {habits.map((habit) => (
                        <li key={habit._id}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
                                    checked={habit.CompletedToday}
                                />
                                <span className="ml-2">{habit.Name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No habits</p>
            )}
        </div>
    );
}

export default Habit;

import React from 'react';

const Habit = ({ HabitList }) => {
    const handleCompleteHabit = async (habitId, isChecked) => {
        const status = isChecked; // Set status based on checkbox state

        const response = await fetch("/api/completeHabit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ habitId, status }),
        });

        if (response.ok) {
            console.log("Habit completed");
        } else {
            console.log("Error completing habit");
        }
    }

    return (
        <div>
            <h1>Habit Leveling</h1>
            <h2>Habits</h2>
            {HabitList && HabitList.length > 0 ? (
                <ul>
                    {HabitList.map((habit) => (
                        <li key={habit._id}>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
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

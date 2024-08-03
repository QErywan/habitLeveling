import UserData from "./dbModels/UserData";

export async function removeHabitExperience(userId, habitId) {
    const user = await UserData.findOne({ UserId: userId });
    const habit = user.HabitList.find((h) => h._id == habitId);

    if (habit.CompletedToday) {
        return;
    }

    const currExp = user.Experience;

    const newExp = currExp - 5; // default habit xp

    if (newExp < 0) {
        return;
    } else {
        await UserData.updateOne(
            { UserId: userId },
            {
                $set: {
                    Experience: newExp,
                },
            }
        );
    }

    return;
}

import UserData from "./dbModels/UserData";

export async function addHabitExperience(userId, habitId) {
    const user = await UserData.findOne({ UserId: userId });
    const habit = user.HabitList.find((h) => h._id == habitId);

    if (!habit.CompletedToday) {
        return;
    }

    const currExp = user.Experience;

    const newExp = 5 + currExp; // default habit xp

    await UserData.updateOne(
        { UserId: userId },
        {
            $set: {
                Experience: newExp,
            },
        }
    );
    console.log("Habit experience added");

    return;
}
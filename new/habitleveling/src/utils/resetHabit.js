import UserData from "./dbModels/UserData";

export async function resetHabitsIfNeeded(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const user = await UserData.findOne({ UserId: userId });

    if (user.LastResetDate < today) {
        await UserData.updateOne(
            { UserId: userId },
            {
                $set: {
                    "HabitList.$[].CompletedToday": false,
                    LastResetDate: new Date(),
                },
            }
        );
    }
}
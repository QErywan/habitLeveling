import UserData from "./dbModels/UserData";

export async function levelUpIfNeeded(userId) {

    const user = await UserData.findOne({ UserId: userId });

    if (!user) {
        return;
    }

    const currExp = user.Experience;
    const currLevel = user.Level;
    const currPoints = user.Points;

    const expToNextLevel = 10 * currLevel * 1.25; // maybe change in the future

    if (currExp >= expToNextLevel) {
        await UserData.updateOne(
            { UserId: userId },
            {
                $set: {
                    Experience: currExp - expToNextLevel,
                    Level: currLevel + 1,
                    Points: currPoints + 3,
                },
            }
        );
        console.log("Level up!");
    }
};
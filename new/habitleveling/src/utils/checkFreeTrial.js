import UserAccount from "./dbModels/UserAccount";

export async function checkFreeTrial(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    const userAccount = await UserAccount.findOne({ _id: userId });
    
    if (userAccount.freeTrialEnd < today) {
        await UserAccount.updateOne(
            { _id: userId },
            {
                $set: {
                    "freeTrial": false,
                },
            }
        );
        
    }
    return;
}
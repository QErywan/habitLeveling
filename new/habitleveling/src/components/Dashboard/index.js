import { signOut } from "next-auth/react";
import Habit from "../Habit";
import AddHabitButton from "../Habit/AddHabitButton";

const Dashboard = ({ userData }) => {
    // Destructure the userData object for easier access

    if (!userData) {
        return (
            <div>
                <h1>Dashboard</h1>
                <p>Loading user data...</p>
                <button onClick={() => signOut({callbackUrl: "/dashboard"})}>Sign Out</button>
            </div>
        );
    }


    const { Username, JobTitle, Level, Experience, Stats, HabitList } = userData;

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => signOut({callbackUrl: "/dashboard"})}>Sign Out</button>

            <div>
                <h2>User Information</h2>
                <p>Username: {Username}</p>
                <p>Job Title: {JobTitle}</p>
                <p>Level: {Level}</p>
                <p>Experience: {Experience}</p>
            </div>

            <div>
                <h2>Stats</h2>
                {Stats && Stats[0] && (
                    <ul>
                        {Object.entries(Stats[0]).map(([stat, value]) => (
                            <li key={stat}>{stat}: {value}</li>
                        ))}
                    </ul>
                )}
            </div>

            <Habit HabitList={HabitList} />
            <AddHabitButton />



        </div>
    );
}

export default Dashboard;
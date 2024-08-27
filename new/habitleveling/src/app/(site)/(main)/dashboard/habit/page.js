import DashboardHabit from "@/components/Dashboard/Habit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: 'Habits',
    description:
      'Your habits and streaks are displayed here. Keep up the good work!',
  };

export default function DashboardHabitPage() {

    return (
        <>
            <ToastContainer />
            <DashboardHabit />
        </>
    );
}

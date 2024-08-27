
import DashboardStatus from "@/components/Dashboard/Status";
import exp from "constants";
import { ToastContainer, toast } from "react-toastify";

export const metadata = {
    title: 'Status',
    description: 'Your current status and progress are displayed here. Keep up the good work!',
};


export default function DashboardStatusPage() {

    return (
        <>
            <DashboardStatus />
            <ToastContainer />
        </>
    ) 
}
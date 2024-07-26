import { useRouter } from "next/navigation";

const AddHabitButton = () => {

    const router = useRouter();

    const onClick = () => {
        console.log('Add Habit');

        router.push('/newHabit');

    }
    
    return (
        <button
            onClick={onClick}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
        >
            Add Habit
        </button>
    );

    
}

export default AddHabitButton;
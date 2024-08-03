import { useRouter } from "next/navigation";

const AddHabitButton = () => {

    const router = useRouter();

    const onClick = () => {
        console.log('Add Habit');

        router.push('/newHabit');

    }
    
    return (
        // <button
        //     onClick={onClick}
        //     className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-md"
        // >
        //     Add Habit
        // </button>
        <div className='lg:hidden flex-auto'>
                        <div className='flex-col card bg-indigo-700 gap-0 items-center'>

                            {/* Title */}
                            <div className="flex py-2 ">
                                <div className='flex py-2 px-3 border text-center rounded-md'>
                                    <h1 className="text-4xl font-extrabold bg-clip-text">HABIT</h1>
                                </div>
                            </div>


                            {/* Content */}
                            <div className='flex flex-col gap-3 flex-initial w-full'>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-auto px-5 py-2 max-h-[25rem] w-full">

                                    {/* Habit List */}
                                    {habits && habits.length > 0 ? ((habits.map((habit) => (
                                        <div className="flex flex-row card bg-indigo-800 px-2 h-20">
                                            <label className="flex items-center justify-between w-full">
                                                <span className="ml-2">{habit.Name}</span>
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox checkbox checkbox-lg checkbox-primary"
                                                    onChange={(e) => handleCompleteHabit(habit._id, e.target.checked)}
                                                    checked={habit.CompletedToday}
                                                />
                                            </label>
                                        </div>
                                    ))) ) : (
                                        <p>Add habit with the button above!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex-col card bg-indigo-700 gap-0 items-center my-2">
                            <button
                                onClick={addHabit}
                                className="h-10 w-full hover:bg-indigo-900  rounded-lg text-white text-xl text-center"
                            >
                                Add Habit
                            </button>
                        </div>

                    </div>
    );

    
}

export default AddHabitButton;
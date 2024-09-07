// components/DashboardSkeleton.js
const DashboardSkeleton = () => {
    return (
        <div className="bg-base-100 text-white p-6 min-h-screen animate-pulse">
            {/* Skeleton structure */}
            <div className="hidden lg:flex">
                <div className="lg:w-44 card lg:justify-center lg:px-4 lg:static">
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-700 h-8 rounded"></div>
                        <div className="bg-gray-700 h-8 rounded"></div>
                        <div className="bg-gray-700 h-8 rounded"></div>
                    </div>
                </div>
                <div className="flex flex-row gap-4 h-screen max-h-[30rem] mx-auto">
                    <div className="flex flex-col card bg-neutral gap-0 w-full">
                        <div className="py-2 flex flex-row p-4">
                            <div className='mx-96 py-2 px-3 border text-center rounded-md'>
                                <div className="bg-gray-700 h-8 rounded"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5 overflow-y-scroll px-5 py-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-base-200 px-2 h-20 border border-white flex items-center justify-between">
                                    <div className="bg-gray-700 h-8 w-3/4 rounded"></div>
                                    <div className="bg-gray-700 h-8 w-8 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardSkeleton;

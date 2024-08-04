"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export const plans = [
    {
        link: "https://buy.stripe.com/test_28og2meQgaHbdc46oo",
        priceId: 'price_1PidQTCZcQdzDKimYN4YERJS',
        price: 19,
        duration: '/month'
    },
];

export const monthlyPlan = {
        link: "https://buy.stripe.com/test_28og2meQgaHbdc46oo",
        priceId: 'price_1PidQTCZcQdzDKimYN4YERJS',
        price: 9,
        duration: '/month'
    };


const Pricing = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className='bg-indigo-800 mx-auto h-screen items-center pt-20 '>
                {/* <h2>Pricing</h2>
                <div>
                    {plans.map(plan => (
                        <div key={plan.priceId}>
                            <h3>{plan.price} {plan.duration}</h3>
                            <a target='_blank' href={plan.link + '?prefilled_email=' + session?.user?.email}>Subscribe</a>
                        </div>
                    ))}
                </div> */}

                {/* Back to dashboard */}
                <div class="flex justify-center">
                    <a href="/dashboard" class="text-white text-center">Back to dashboard</a>
                </div>

                {/* Pricing plan */}
                <div class="bg-white rounded-lg shadow-lg px-8 py-8 max-w-sm m-auto" key={monthlyPlan.priceId}>
                    <div className='h-[20rem]'>
                        <div class="text-center">
                            <div class="mt-6">
                            <span class="text-4xl font-extrabold text-gray-600">£{monthlyPlan.price}</span>
                            <span class="text-gray-600">/month</span>
                            </div>
                        </div>
                        <div class="mt-8 text-center">
                            <a target='_blank' href={monthlyPlan.link + '?prefilled_email=' + session?.user?.email} class="bg-purple-700 text-white py-3 px-11 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">Start leveling up</a>
                        </div>

                        <ul class="mt-8 space-y-4">
                            <li class="flex items-center">
                                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="ml-3 text-gray-700">Unlimited habits and status screen</span>
                            </li>
                            <li class="flex items-center">
                                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="ml-3 text-gray-700">Level up yourself</span>
                            </li>
                            <li class="flex items-center">
                                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="ml-3 text-gray-700">Feel empowered through small habits</span>
                            </li>
                            <li class="flex items-center">
                                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span class="ml-3 text-gray-700">Make life feel like a game</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* FAQ */}
            </div>
        </>
    )
}

export default Pricing;
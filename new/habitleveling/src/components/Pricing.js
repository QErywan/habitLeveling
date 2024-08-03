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


const Pricing = () => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <section>
            <h2>Pricing</h2>
            <div>
                {plans.map(plan => (
                    <div key={plan.priceId}>
                        <h3>{plan.price} {plan.duration}</h3>
                        <a target='_blank' href={plan.link + '?prefilled_email=' + session?.user?.email}>Subscribe</a>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Pricing;
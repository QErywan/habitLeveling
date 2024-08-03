"use client"

import { signIn, useSession } from "next-auth/react";

const customerPortalLink = "https://billing.stripe.com/p/login/test_aEU03l8TX9TubK0288"

const ButtonCustomerPortal = () => {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        return (
            <a
                href={
                    customerPortalLink + 
                    "?prefilled_email=" +
                    session.user?.email
                }
                className="btn btn-primary"
            >
                Billing
            </a>

        );
    }

    return (
        <button className="btn btn-primary" onClick={signIn}>
            Sign in to access
        </button>
    )
}

export default ButtonCustomerPortal;
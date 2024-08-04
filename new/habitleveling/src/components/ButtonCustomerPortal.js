"use client"

import { signIn, useSession } from "next-auth/react";

const customerPortalLink = "https://billing.stripe.com/p/login/test_aEU03l8TX9TubK0288"

const ButtonCustomerPortal = () => {
    const { data: session, status } = useSession();

    if (status === "authenticated") {
        return (
            // <div className="navbar bg-indigo-900">
            //     <a
            //         href={
            //             customerPortalLink + 
            //             "?prefilled_email=" +
            //             session.user?.email
            //         }
            //         className="btn btn-primary"
            //     >
            //         Billing
            //     </a>
            // </div>
            <div className="navbar bg-base-100">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">Habit Leveling ICON</a>
            </div>
            <div className="navbar-center">
                
            </div>
            <div className="flex-none">
                <ul class="menu menu-horizontal px-1">
                    <li><a href={customerPortalLink + "?prefilled_email=" + session.user?.email}>Billing or Upgrade</a></li>
                </ul>
            </div>
          </div>

        );
    }

    return (
        <button className="btn btn-primary" onClick={signIn}>
            Sign in to access
        </button>
    )
}

export default ButtonCustomerPortal;
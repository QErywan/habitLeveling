import { plans } from '@/components/Plans';
import UserAccount from '@/utils/dbModels/UserAccount';
import UserLoginData from '@/utils/dbModels/UserLoginData';
import UserLoginDataExternal from '@/utils/dbModels/UserLoginDataExternal';
import dbConnect from '@/utils/mongodb';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {

    await dbConnect();

    const body = await req.text();

    const signature = headers().get('stripe-signature');

    let data;
    let eventType;
    let event;

    // verify Stripe event is real
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed. ${err.message}`);
        return NextResponse.error(err);
    }

    data = event.data;
    eventType = event.type;

    try {
        switch (eventType) {
            case 'checkout.session.completed': {
                console.log('checkout.session.completed in webhook');
                const session = await stripe.checkout.sessions.retrieve(data.object.id, { expand: ['line_items'] });


                const customerId = session?.customer;
                const customer = await stripe.customers.retrieve(customerId);

                const priceId = session?.line_items?.data[0]?.price.id;
                const plan = plans.find((p) => p.priceId === priceId);

                if (!plan) {
                    break;
                }

                let user;
                let userLoginData;

                console.log(customer.email);

                if (customer.email) {
                    userLoginData = await UserLoginData.findOne({ EmailAddress: customer.email });

                    // if (!userLoginData) {
                    //     userLoginData = UserLoginDataExternal.findOne({ EmailAddress: customer.email });
                    // }

                    if (userLoginData) {
                        user = await UserAccount.findOne({ _id: userLoginData.UserId });
                    }

                    // a way to make a user account maybe

                } else {
                    console.error('No email found for customer');
                    throw new Error('No email found for customer');
                }

                user.hasAccess = true;
                user.customerId = customerId;
                await user.save();

                break;
            }
                

            case 'customer.subscription.deleted': {
                const subscription = await stripe.subscriptions.retrieve(data.object.id);
                const user = await UserAccount.findOne({ customerId: subscription.customer });

                user.hasAccess = false;
                await user.save();

                break;
            }

            default:
                break;
        
        }
    } catch (error) {
        console.error(error);
        return NextResponse.error(error);
    }

    return NextResponse.json({});

}
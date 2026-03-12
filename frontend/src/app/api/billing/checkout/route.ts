import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PRO_PRICE_ID, stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscription: true },
    });
    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId || undefined;

    if (!stripeCustomerId && process.env.STRIPE_SECRET_KEY) {
        const customer = await stripe.customers.create({
            email: session.user.email,
            metadata: { userId: user.id },
        });

        stripeCustomerId = customer.id;

        await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                stripeCustomerId,
                status: "inactive",
            },
            update: { stripeCustomerId },
        });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return new NextResponse("Stripe is not configured.", { status: 500 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        line_items: [
            {
                price: PRO_PRICE_ID,
                quantity: 1,
            },
        ],
        success_url: `${origin}/dashboard?upgrade=success`,
        cancel_url: `${origin}/dashboard?upgrade=cancelled`,
        billing_address_collection: "auto",
        allow_promotion_codes: true,
        subscription_data: {
            metadata: {
                userId: user.id,
            },
        },
        metadata: {
            userId: user.id,
        },
    });

    return NextResponse.json({ url: checkoutSession.url });
}


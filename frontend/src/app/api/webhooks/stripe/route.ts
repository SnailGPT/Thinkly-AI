import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !secret || !process.env.STRIPE_SECRET_KEY) {
        return new NextResponse("Stripe webhook not configured.", { status: 400 });
    }

    const rawBody = await req.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err) {
        console.error("Stripe webhook signature verification failed", err);
        return new NextResponse("Invalid signature", { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as any;
                const userId = session.metadata?.userId || session.subscription_metadata?.userId;
                const customerId = session.customer as string | undefined;

                if (userId && customerId) {
                    await prisma.subscription.upsert({
                        where: { userId },
                        create: {
                            userId,
                            stripeCustomerId: customerId,
                            stripePriceId: session.line_items?.[0]?.price?.id ?? null,
                            status: "active",
                            currentPeriodEnd: new Date((session.expires_at ?? session.current_period_end) * 1000),
                        },
                        update: {
                            stripeCustomerId: customerId,
                            stripePriceId: session.line_items?.[0]?.price?.id ?? null,
                            status: "active",
                        },
                    });
                }
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.created": {
                const sub = event.data.object as any;
                const userId = sub.metadata?.userId;
                if (userId) {
                    await prisma.subscription.upsert({
                        where: { userId },
                        create: {
                            userId,
                            stripeCustomerId: sub.customer as string,
                            stripePriceId: sub.items?.data?.[0]?.price?.id ?? null,
                            status: sub.status,
                            currentPeriodEnd: new Date(sub.current_period_end * 1000),
                        },
                        update: {
                            stripeCustomerId: sub.customer as string,
                            stripePriceId: sub.items?.data?.[0]?.price?.id ?? null,
                            status: sub.status,
                            currentPeriodEnd: new Date(sub.current_period_end * 1000),
                        },
                    });
                }
                break;
            }
            case "customer.subscription.deleted": {
                const sub = event.data.object as any;
                const userId = sub.metadata?.userId;
                if (userId) {
                    await prisma.subscription.updateMany({
                        where: { userId },
                        data: { status: "canceled" },
                    });
                }
                break;
            }
            default:
                break;
        }
    } catch (err) {
        console.error("Stripe webhook handler error", err);
        return new NextResponse("Webhook handler error", { status: 500 });
    }

    return new NextResponse("ok", { status: 200 });
}


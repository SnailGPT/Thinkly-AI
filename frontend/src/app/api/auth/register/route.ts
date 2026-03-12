import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return new NextResponse('Missing Data', { status: 400 });
        }

        const exist = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        });

        if (exist) {
            return new NextResponse('User already exists', { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                usage: {
                    create: {
                        aiMessagesToday: 0,
                        uploadsToday: 0
                    }
                }
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

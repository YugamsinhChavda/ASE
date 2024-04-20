import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Options } from "../auth/[...nextauth]/route";
import { User } from "@/models/user";

export async function PUT(req) {
    const userData = await req.json();
    mongoose.connect(process.env.MONGO_URL);

    let filter = {}

    if (userData._id) {
        const _id = userData._id;
        filter = {_id};
    }
    else {
        const userSession = await getServerSession(Options);
        const email = userSession.user.email;
        filter = {email};
    }

    await User.updateOne(filter, userData);
    return Response.json(true);
}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    const userSession = await getServerSession(Options);
    const email = userSession?.user?.email;
    if (!email) {
        return Response.json({});
    }
    return Response.json(
        await User.findOne({ email })
    )
}
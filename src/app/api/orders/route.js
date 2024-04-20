import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { Options, isAdmin } from "../auth/[...nextauth]/route";
import { Order } from "@/models/order";

export async function GET(req){
    mongoose.connect(process.env.MONGO_URL);
    
    const session = await getServerSession(Options);
    const email = session?.user?.email;
    const admin = await isAdmin();

    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    if(_id){
        return Response.json(await Order.findById(_id));
    }

    // if(email){
    //     const userInformation = await User.findOne({email:email});
    //     if(userInformation){
    //         isAdmin = userInformation.admin;
    //     }
    // }

    if(admin) {
        return Response.json(await Order.find());
    }

    if(email){
        return Response.json(await Order.find({email}));
    }

}
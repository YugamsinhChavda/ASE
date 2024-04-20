import mongoose from "mongoose";
import { MenuItem } from "../../../models/menuitems";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {
    const data = await req.json();
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        const menuItems = await MenuItem.create(data);
        return Response.json(menuItems);
    }
    else {
        return Response.json({});
    }

}

// export async function GET(){
//     mongoose.connect(process.env.MONGO_URL);
//     const items = await MenuItem.find();
//     return Response.json(items);
// }

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    const items = await MenuItem.find().sort({ timestamp: -1 });
    return Response.json(items);
}

export async function PUT(req) {
    const data = await req.json();
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        await MenuItem.findByIdAndUpdate(data._id, data);
    }
    return Response.json(true);
}

export async function DELETE(req) {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        await MenuItem.deleteOne({ _id });
    }
    return Response.json(true);
}
import mongoose from "mongoose";
import { Category } from "../../../models/category";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {
    const { name } = await req.json();
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        const newCategory = await Category.create({ name });
        return Response.json(newCategory);
    }
    else {
        return Response.json({});
    }

}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    const categories = await Category.find();
    return Response.json(categories);
}

export async function PUT(req) {
    const { _id, name } = await req.json();
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        await Category.updateOne({ _id }, { name });
    }
    return Response.json(true);
}

export async function DELETE(req) {
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    mongoose.connect(process.env.MONGO_URL);
    if (await isAdmin()) {
        await Category.deleteOne({ _id });
    }
    return Response.json(true);
}
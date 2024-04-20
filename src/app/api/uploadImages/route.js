import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req){
    const data = await req.formData();
    const file = data.get('file');
    if(!file) {
        return Response.json(false);
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join('./public/Images/',file.name);
    await writeFile(path,buffer);

    return Response.json(file.name);
}
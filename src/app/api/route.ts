import {NextRequest, NextResponse} from "next/server";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import {images} from "@/app/global-store";

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: NextRequest, {params}: Params, response: NextResponse) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('imageId');
    console.log("query =>", query);
    if (query) {
        const imageId = parseInt(query, 10);
        return Response.json(images[imageId - 1])
    } else {
        return Response.json(images);
    }
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "all-meat";
    const sentance = url.searchParams.get("sentances") || "5";

    try{
        const res = await fetch(
            `https://baconipsum.com/api/?type=${type}&sentences=${sentance}`
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch from Bacon Ipsum" }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "An error occurred while fetching from Bacon Ipsum" }, { status: 500 });
    }
}

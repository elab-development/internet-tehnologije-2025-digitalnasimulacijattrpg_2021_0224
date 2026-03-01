import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // Uzmi naziv videa iz query parametra
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing video query" }, { status: 400 });
  }

  // Poziv YouTube Search API
  const apiRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
      query
    )}&key=${process.env.YOUTUBE_API_KEY}`
  );

  if (!apiRes.ok) {
    return NextResponse.json({ error: "Failed to fetch from YouTube" }, { status: 500 });
  }

  const data = await apiRes.json();

  // Uzmi ID prvog videa
  const videoId = data.items?.[0]?.id?.videoId;

  if (!videoId) {
    return NextResponse.json({ error: "No video found" }, { status: 404 });
  }

  // Vraćamo ID ili neki JSON podatak potreban za frontend embed
  return NextResponse.json({ videoId });
}


// export async function GET(req:NextRequest) {
//     const VIDEO_ID=req.nextUrl.searchParams.get("id");
//     if(!VIDEO_ID){
//         return NextResponse.json({error:"Nema videjo ID"},{status:400});
//     }
//   const response = await fetch(
//     `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${process.env.YOUTUBE_API_KEY}`
//   );

//   if (!response.ok) {
//     return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
//   }

//   const data = await response.json();
//   return NextResponse.json(data);
// }
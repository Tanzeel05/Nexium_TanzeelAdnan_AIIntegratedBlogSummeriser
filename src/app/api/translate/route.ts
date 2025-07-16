import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ur`);
    const data = await response.json();

    return NextResponse.json({ translated: data.responseData.translatedText });

  } catch (err) {
    console.error("MyMemory Translation Error:", err);
    return NextResponse.json({ translated: "⚠️ Translation failed." }, { status: 500 });
  }
}

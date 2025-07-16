import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    console.log("Received URL to scrape:", url);

    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      console.error("Invalid URL provided.");
      return NextResponse.json({ text: "", error: "Invalid URL provided." }, { status: 400 });
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      console.error(`Fetch failed with status: ${res.status}`);
      return NextResponse.json({ text: "", error: `Failed to fetch URL. Status: ${res.status}` }, { status: 500 });
    }

    const html = await res.text();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.error("Readability failed to parse the article.");
      return NextResponse.json({ text: "", error: "Failed to parse article content." }, { status: 500 });
    }

    console.log("Article parsed successfully.");
    return NextResponse.json({ text: article.textContent });

  } catch (err) {
    console.error("Error scraping article:", err);
    return NextResponse.json({ text: "", error: "Internal Server Error while scraping." }, { status: 500 });
  }
}

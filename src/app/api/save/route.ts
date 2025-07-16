import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";  // Make sure this is correctly set

export async function POST(req: NextRequest) {
  const { fullText, summary } = await req.json();

  const { data, error } = await supabase
    .from("summaries")  // Your Supabase table name
    .insert([{ full_text: fullText, summary }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

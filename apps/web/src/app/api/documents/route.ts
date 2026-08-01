import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    const document_type = formData.get("document_type") as string;

    if (!file) {
      return NextResponse.json({ error: "No document file provided" }, { status: 400 });
    }

    return integrationUnavailable({
      service: "Trade document upload and OCR",
      requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_API_KEY or GOOGLE_DOCUMENT_AI_PROCESSOR_ID"],
      developerAction:
        "Upload documents to Supabase Storage, persist document metadata, run a real OCR/vision provider, validate extracted trade fields, and require manual review for low-confidence results.",
    });
  } catch (error) {
    console.error("Document analysis error:", error);
    return NextResponse.json({ error: "Document analysis failed" }, { status: 500 });
  }
}

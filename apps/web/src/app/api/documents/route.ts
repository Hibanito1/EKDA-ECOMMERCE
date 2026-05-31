import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("document") as File | null;
    const document_type = formData.get("document_type") as string;

    if (!file) {
      return NextResponse.json({ error: "No document file provided" }, { status: 400 });
    }

    // In production, this would:
    // 1. Upload to Supabase Storage
    // 2. Call Document AI (Google Cloud Document AI or OpenAI Vision) for OCR
    // 3. Extract data and validate HS codes
    // 4. Flag suspicious documents

    // Simulated AI document analysis
    const analysisResult = simulateDocumentAnalysis(document_type, file.name);

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      file_name: file.name,
      file_size: file.size,
      processed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Document analysis error:", error);
    return NextResponse.json({ error: "Document analysis failed" }, { status: 500 });
  }
}

function simulateDocumentAnalysis(document_type: string, file_name: string) {
  const baseResult = {
    document_type: document_type || "unknown",
    is_authentic: true,
    confidence: 0.94,
    flags: [] as string[],
    summary: "",
    extracted_data: {} as Record<string, unknown>,
    hs_codes_found: [] as string[],
  };

  switch (document_type) {
    case "phytosanitary":
      return {
        ...baseResult,
        confidence: 0.96,
        extracted_data: {
          issuing_authority: "Federal Department of Agriculture, Nigeria",
          issue_date: "2025-05-15",
          expiry_date: "2025-08-15",
          commodity: "Dried crayfish (Penaei)",
          country_of_origin: "Nigeria",
          country_of_destination: "United Kingdom",
          quantity: "500 kg",
          treatment_method: "None required",
          inspector_name: "Dr. O. Okonkwo",
          certificate_number: "FMARD/PHY/2025/001234",
        },
        hs_codes_found: ["0306.17"],
        summary: "Valid phytosanitary certificate from FMARD. Commodity identified as dried crayfish. No treatment required. Valid for 90 days.",
      };

    case "bill_of_lading":
      return {
        ...baseResult,
        confidence: 0.98,
        extracted_data: {
          bl_number: "MAEU2025054321",
          shipper: "Lagos Fresh Exports Ltd",
          consignee: "Diaspora Groceries UK Ltd",
          vessel: "Maersk Enfield",
          port_of_loading: "Apapa Port, Lagos",
          port_of_discharge: "Tilbury, London",
          description: "Said to contain: Dried African spices and condiments",
          gross_weight: "520 kg",
          number_of_packages: "40 cartons",
          freight_terms: "CIF",
        },
        hs_codes_found: ["0306.17", "2103.90"],
        summary: "Valid B/L from Maersk Line. Shipment from Apapa to Tilbury. Two commodity types identified. Check HS code 2103.90 classification.",
        flags: ["Multiple HS codes detected — verify classification accuracy"],
      };

    case "certificate_of_origin":
      return {
        ...baseResult,
        confidence: 0.93,
        extracted_data: {
          certificate_number: "NCC/COO/2025/08721",
          exporter: "Lagos Fresh Exports Ltd",
          consignee: "UK buyer",
          country_of_origin: "Federal Republic of Nigeria",
          description: "Dried crayfish and African spices",
          quantity: "500 kg",
          issued_by: "Nigerian Chamber of Commerce",
          issue_date: "2025-05-16",
        },
        hs_codes_found: ["0306.17"],
        summary: "Valid Certificate of Origin issued by Nigerian Chamber of Commerce. Country of origin confirmed as Nigeria.",
      };

    case "commercial_invoice":
      return {
        ...baseResult,
        confidence: 0.97,
        extracted_data: {
          invoice_number: "LFE-2025-0892",
          seller: "Lagos Fresh Exports Ltd",
          buyer: "Diaspora Groceries UK Ltd",
          date: "2025-05-14",
          incoterms: "CIF London",
          items: [
            { description: "Dried Crayfish", hs_code: "0306.17", qty: "500 kg", unit_price: "USD 12.00", total: "USD 6,000.00" },
          ],
          total_value: "USD 6,000.00",
          currency: "USD",
        },
        hs_codes_found: ["0306.17"],
        summary: "Commercial invoice matches order details. Total value USD 6,000. HS code 0306.17 correctly stated.",
      };

    default:
      return {
        ...baseResult,
        confidence: 0.72,
        is_authentic: true,
        flags: ["Document type not recognized — manual review recommended"],
        summary: "Document uploaded and processed. Unrecognized document type — please review manually.",
      };
  }
}

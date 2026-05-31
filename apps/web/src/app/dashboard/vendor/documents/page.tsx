"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Eye,
  Download,
  Trash2,
  Bot,
  Shield,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DOCUMENT_TYPE_LABELS } from "@ekda/shared";
import toast from "react-hot-toast";

interface DocumentAnalysis {
  document_type: string;
  is_authentic: boolean;
  confidence: number;
  extracted_data: Record<string, unknown>;
  hs_codes_found: string[];
  flags: string[];
  summary: string;
}

interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "analyzing" | "complete" | "error";
  analysis?: DocumentAnalysis;
}

const REQUIRED_DOCS = [
  { type: "commercial_invoice", label: "Commercial Invoice", required: true },
  { type: "packing_list", label: "Packing List", required: true },
  { type: "certificate_of_origin", label: "Certificate of Origin", required: true },
  { type: "phytosanitary", label: "Phytosanitary Certificate", required: false, note: "Required for plant/food products" },
  { type: "bill_of_lading", label: "Bill of Lading", required: false, note: "Required when carrier is assigned" },
];

function DocumentAnalysisResult({ analysis }: { analysis: DocumentAnalysis }) {
  return (
    <div className="mt-3 space-y-3 text-sm">
      {/* Authenticity */}
      <div className={cn(
        "flex items-start gap-2 p-3 rounded-xl",
        analysis.is_authentic
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      )}>
        {analysis.is_authentic ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <div className={cn("font-medium", analysis.is_authentic ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300")}>
            {analysis.is_authentic ? "Document appears authentic" : "Authentication failed"}
          </div>
          <div className={cn("text-xs mt-0.5", analysis.is_authentic ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            AI Confidence: {Math.round(analysis.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-xl">
        <Bot className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-muted-foreground text-xs">{analysis.summary}</p>
      </div>

      {/* HS Codes Found */}
      {analysis.hs_codes_found.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-1.5">HS Codes Identified</div>
          <div className="flex gap-1.5 flex-wrap">
            {analysis.hs_codes_found.map((code) => (
              <code key={code} className="bg-muted px-2 py-1 rounded text-xs font-mono font-semibold">
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      {analysis.flags.length > 0 && (
        <div className="space-y-1">
          {analysis.flags.map((flag, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-yellow-700 dark:text-yellow-400">{flag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Extracted Data */}
      {Object.keys(analysis.extracted_data).length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground font-medium hover:text-foreground">
            View extracted data ({Object.keys(analysis.extracted_data).length} fields)
          </summary>
          <div className="mt-2 bg-muted/30 rounded-xl p-3 space-y-1.5">
            {Object.entries(analysis.extracted_data).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium text-right max-w-[60%] text-foreground">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [selectedType, setSelectedType] = useState("commercial_invoice");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      const newDoc: UploadedDoc = {
        id,
        name: file.name,
        size: file.size,
        type: selectedType,
        status: "uploading",
      };

      setDocuments((prev) => [...prev, newDoc]);

      try {
        // Simulate upload
        await new Promise((r) => setTimeout(r, 1000));
        setDocuments((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: "analyzing" } : d))
        );

        // Call AI analysis API
        const formData = new FormData();
        formData.append("document", file);
        formData.append("document_type", selectedType);

        // Simulate API call delay
        await new Promise((r) => setTimeout(r, 2000));

        // Simulate analysis result
        const mockAnalysis: DocumentAnalysis = {
          document_type: selectedType,
          is_authentic: true,
          confidence: 0.94 + Math.random() * 0.05,
          extracted_data: {
            issuing_authority: "Federal Ministry, Nigeria",
            issue_date: "2025-05-15",
            commodity: "African food products",
            certificate_number: `EKDA/DOC/${Date.now()}`,
          },
          hs_codes_found: ["0306.17", "2103.90"],
          flags: [],
          summary: `${DOCUMENT_TYPE_LABELS[selectedType as keyof typeof DOCUMENT_TYPE_LABELS] || "Document"} analyzed successfully. Content appears authentic with high confidence.`,
        };

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: "complete", analysis: mockAnalysis } : d
          )
        );
        toast.success("Document analyzed successfully!");
      } catch (err) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: "error" } : d))
        );
        toast.error("Document analysis failed");
      }
    }
  }, [selectedType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Document Verification</h1>
          <p className="text-muted-foreground text-sm">
            Upload trade documents for AI-powered OCR extraction and verification
          </p>
        </div>
        <Badge variant="gold" className="ml-auto">
          <Bot className="h-3 w-3" />
          AI Powered
        </Badge>
      </div>

      {/* Required Documents Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Required Documents Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REQUIRED_DOCS.map((doc) => {
              const uploaded = documents.some((d) => d.type === doc.type && d.status === "complete");
              return (
                <div
                  key={doc.type}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl",
                    uploaded ? "bg-green-50 dark:bg-green-900/20" : "bg-muted/30"
                  )}
                >
                  {uploaded ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <div className={cn("h-4 w-4 rounded-full border-2 flex-shrink-0", doc.required ? "border-destructive" : "border-muted-foreground")} />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{doc.label}</div>
                    {doc.note && (
                      <div className="text-xs text-muted-foreground">{doc.note}</div>
                    )}
                  </div>
                  {doc.required && !uploaded && (
                    <Badge variant="error" className="text-[10px]">Required</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Document Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <div className="text-base font-semibold mb-1">
              {isDragActive ? "Drop documents here" : "Drag & drop documents here"}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse — PDF, JPG, PNG, DOCX (max 10MB)
            </p>
            <Button variant="outline" size="sm">
              Browse Files
            </Button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            AI will extract data, verify authenticity, and identify HS codes from your documents automatically.
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <AnimatePresence>
        {documents.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Uploaded Documents ({documents.length})</h2>
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">{doc.name}</span>
                          <Badge
                            variant={
                              doc.status === "complete"
                                ? "success"
                                : doc.status === "error"
                                ? "error"
                                : "outline"
                            }
                            className="text-[10px] flex-shrink-0"
                          >
                            {doc.status === "uploading" && <Loader2 className="h-2.5 w-2.5 mr-1 animate-spin" />}
                            {doc.status === "analyzing" && <Bot className="h-2.5 w-2.5 mr-1" />}
                            {doc.status === "complete" && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
                            {doc.status === "error" && <AlertTriangle className="h-2.5 w-2.5 mr-1" />}
                            {doc.status === "uploading" ? "Uploading..." : doc.status === "analyzing" ? "AI Analyzing..." : doc.status === "complete" ? "Verified" : "Error"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] || doc.type} · {(doc.size / 1024).toFixed(1)} KB
                        </div>

                        {/* Analysis results */}
                        {doc.status === "complete" && doc.analysis && (
                          <DocumentAnalysisResult analysis={doc.analysis} />
                        )}
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

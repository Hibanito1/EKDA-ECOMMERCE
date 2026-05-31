"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  User,
  CreditCard,
  Building2,
  MapPin,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  Shield,
  AlertTriangle,
  Loader2,
  FileText,
  Eye,
  X,
  Bot,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { UserRole } from "@ekda/shared";

const KYC_STEPS = [
  { id: "personal", title: "Personal Info", icon: User, description: "Basic identity details" },
  { id: "identity", title: "ID Verification", icon: CreditCard, description: "Government-issued ID" },
  { id: "business", title: "Business Details", icon: Building2, description: "Company registration" },
  { id: "address", title: "Address Proof", icon: MapPin, description: "Residential or business address" },
  { id: "banking", title: "Bank Information", icon: Landmark, description: "Payment account details" },
  { id: "review", title: "Review & Submit", icon: CheckCircle2, description: "Final review" },
];

const VENDOR_STEPS = KYC_STEPS;
const CARRIER_STEPS = KYC_STEPS;
const CUSTOMER_STEPS = KYC_STEPS.filter((s) => s.id !== "business");

interface DocumentUploadZoneProps {
  label: string;
  hint?: string;
  accept?: Record<string, string[]>;
  onUpload: (file: File) => void;
  uploaded?: string | null;
  aiScore?: number | null;
  loading?: boolean;
}

function DocumentUploadZone({
  label,
  hint,
  accept,
  onUpload,
  uploaded,
  aiScore,
  loading,
}: DocumentUploadZoneProps) {
  const onDrop = useCallback(
    (files: File[]) => {
      if (files[0]) onUpload(files[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { "image/*": [".jpg", ".jpeg", ".png"], "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {uploaded ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
              Document uploaded
            </div>
            {aiScore !== undefined && aiScore !== null && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Bot className="h-3 w-3 text-green-600" />
                <span className="text-[10px] text-green-600">
                  AI Score: {Math.round(aiScore * 100)}% authentic
                </span>
                <div
                  className={cn(
                    "h-1.5 w-16 rounded-full",
                    aiScore >= 0.85 ? "bg-green-500" : aiScore >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ background: `linear-gradient(to right, ${aiScore >= 0.85 ? "#22c55e" : aiScore >= 0.6 ? "#f59e0b" : "#ef4444"} ${Math.round(aiScore * 100)}%, #e5e7eb ${Math.round(aiScore * 100)}%)` }}
                />
              </div>
            )}
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 text-green-600 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF · Max 10MB</p>
        </div>
      )}
    </div>
  );
}

interface KYCFormProps {
  role: UserRole;
  onComplete?: (applicationId: string) => void;
}

export function KYCForm({ role, onComplete }: KYCFormProps) {
  const steps = role === "customer" ? CUSTOMER_STEPS : VENDOR_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string | null>>({});
  const [aiScores, setAiScores] = useState<Record<string, number | null>>({});

  const [formData, setFormData] = useState({
    // Personal
    full_name: "",
    date_of_birth: "",
    nationality: "Nigerian",
    gender: "",
    phone: "",
    email: "",
    // ID
    id_type: "national_id",
    id_number: "",
    id_expiry_date: "",
    // Business
    business_name: "",
    business_type: "limited_liability",
    registration_number: "",
    year_established: "",
    website: "",
    description: "",
    // Address
    street_address: "",
    city: "",
    state: "",
    country: "NG",
    postal_code: "",
    address_proof_type: "utility_bill",
    // Banking
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_code: "",
    swift_code: "",
  });

  const update = (key: string, value: string) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const handleDocumentUpload = async (docKey: string, file: File) => {
    const fakeUrl = URL.createObjectURL(file);
    setUploadedDocs((prev) => ({ ...prev, [docKey]: fakeUrl }));
    setAiAnalyzing(true);

    // Simulate AI document verification
    await new Promise((r) => setTimeout(r, 2500));
    const score = 0.85 + Math.random() * 0.14;
    setAiScores((prev) => ({ ...prev, [docKey]: score }));
    setAiAnalyzing(false);

    if (score < 0.6) {
      toast.error("⚠️ Document quality is low. Please upload a clearer image.");
    } else {
      toast.success("✅ Document verified by AI");
    }
  };

  const handleNext = () => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("🎉 KYC application submitted! Review within 24 hours.");
        onComplete?.(data.application_id);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep]!;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-ekda-green-800 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">KYC Verification</h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length} — {currentStepData.description}
          </p>
        </div>
        <Badge
          variant={
            role === "vendor" ? "export" : role === "carrier" ? "blue" : "outline"
          }
          className="ml-auto capitalize"
        >
          {role}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-ekda-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-3 overflow-x-auto">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[52px] transition-all",
                i <= currentStep ? "cursor-pointer" : "cursor-default opacity-40"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                  i < currentStep
                    ? "bg-primary border-primary text-white"
                    : i === currentStep
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted text-muted-foreground"
                )}
              >
                {i < currentStep ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <step.icon className="h-3.5 w-3.5" />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium text-center leading-tight hidden sm:block",
                  i === currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <currentStepData.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
              </div>

              {/* Step 1: Personal Info */}
              {currentStepData.id === "personal" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input label="Full Legal Name" value={formData.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="As shown on your ID" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Date of Birth <span className="text-destructive">*</span></label>
                    <input type="date" value={formData.date_of_birth} onChange={(e) => update("date_of_birth", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Nationality <span className="text-destructive">*</span></label>
                    <select value={formData.nationality} onChange={(e) => update("nationality", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Nigerian</option>
                      <option>British</option>
                      <option>American</option>
                      <option>German</option>
                      <option>Chinese</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Gender</label>
                    <select value={formData.gender} onChange={(e) => update("gender", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input type="tel" label="Phone Number" value={formData.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 801 234 5678" required />
                  <div className="col-span-2">
                    <Input type="email" label="Email Address" value={formData.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" required />
                  </div>
                </div>
              )}

              {/* Step 2: ID Verification */}
              {currentStepData.id === "identity" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">ID Type <span className="text-destructive">*</span></label>
                    <select value={formData.id_type} onChange={(e) => update("id_type", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="national_id">National Identity Card (NIN)</option>
                      <option value="passport">International Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="voters_card">Voter's Card</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="ID Number" value={formData.id_number} onChange={(e) => update("id_number", e.target.value)} placeholder="ID number" required />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Expiry Date</label>
                      <input type="date" value={formData.id_expiry_date} onChange={(e) => update("id_expiry_date", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <DocumentUploadZone
                    label="Upload ID Document (Front) *"
                    hint="Clear photo of the front of your ID. JPEG, PNG, or PDF"
                    onUpload={(f) => handleDocumentUpload("id_front", f)}
                    uploaded={uploadedDocs.id_front}
                    aiScore={aiScores.id_front}
                    loading={aiAnalyzing}
                  />
                  <DocumentUploadZone
                    label="Upload Selfie with ID *"
                    hint="Hold your ID next to your face — clear and readable"
                    onUpload={(f) => handleDocumentUpload("id_selfie", f)}
                    uploaded={uploadedDocs.id_selfie}
                    aiScore={aiScores.id_selfie}
                    loading={aiAnalyzing}
                  />
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Your ID documents are encrypted, used only for verification, and handled in compliance with NDPR and GDPR. They are never shared with third parties without your consent.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Business Details */}
              {currentStepData.id === "business" && (role === "vendor" || role === "carrier" || role === "enterprise") && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Input label="Business / Company Name" value={formData.business_name} onChange={(e) => update("business_name", e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Business Type</label>
                      <select value={formData.business_type} onChange={(e) => update("business_type", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="sole_proprietor">Sole Proprietor</option>
                        <option value="limited_liability">Limited Liability (LLC)</option>
                        <option value="partnership">Partnership</option>
                        <option value="plc">Public Ltd Company (PLC)</option>
                        <option value="cooperative">Cooperative</option>
                        <option value="ngo">NGO / Non-profit</option>
                      </select>
                    </div>
                    <Input label="CAC Registration Number" value={formData.registration_number} onChange={(e) => update("registration_number", e.target.value)} placeholder="RC1234567" />
                    <Input label="Year Established" value={formData.year_established} onChange={(e) => update("year_established", e.target.value)} placeholder="2018" />
                    <Input label="Website (optional)" value={formData.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourbiz.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Business Description</label>
                    <textarea value={formData.description} onChange={(e) => update("description", e.target.value)}
                      className="w-full h-24 px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Describe your business, products/services, and target markets..." />
                  </div>
                  <DocumentUploadZone
                    label="Upload CAC Certificate / Company Registration *"
                    hint="Certificate of Incorporation or Business Name Registration"
                    onUpload={(f) => handleDocumentUpload("cac_certificate", f)}
                    uploaded={uploadedDocs.cac_certificate}
                    aiScore={aiScores.cac_certificate}
                    loading={aiAnalyzing}
                  />
                </div>
              )}

              {/* Step 4: Address Proof */}
              {currentStepData.id === "address" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Input label="Street Address" value={formData.street_address} onChange={(e) => update("street_address", e.target.value)} placeholder="123 Main Street, Victoria Island" required />
                    </div>
                    <Input label="City" value={formData.city} onChange={(e) => update("city", e.target.value)} placeholder="Lagos" required />
                    <Input label="State / Province" value={formData.state} onChange={(e) => update("state", e.target.value)} placeholder="Lagos State" required />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Country <span className="text-destructive">*</span></label>
                      <select value={formData.country} onChange={(e) => update("country", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="NG">Nigeria</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="DE">Germany</option>
                        <option value="CN">China</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                    <Input label="Postal Code" value={formData.postal_code} onChange={(e) => update("postal_code", e.target.value)} placeholder="100001" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Proof of Address Type</label>
                    <select value={formData.address_proof_type} onChange={(e) => update("address_proof_type", e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="utility_bill">Utility Bill (within 3 months)</option>
                      <option value="bank_statement">Bank Statement (within 3 months)</option>
                      <option value="government_letter">Government-issued Letter</option>
                      <option value="lease_agreement">Lease / Tenancy Agreement</option>
                      <option value="phone_bill">Phone Bill</option>
                    </select>
                  </div>
                  <DocumentUploadZone
                    label="Upload Proof of Address *"
                    hint="Must show your name and address, dated within 3 months"
                    onUpload={(f) => handleDocumentUpload("address_proof", f)}
                    uploaded={uploadedDocs.address_proof}
                    aiScore={aiScores.address_proof}
                    loading={aiAnalyzing}
                  />
                </div>
              )}

              {/* Step 5: Banking */}
              {currentStepData.id === "banking" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-medium">Bank Name <span className="text-destructive">*</span></label>
                      <select value={formData.bank_name} onChange={(e) => update("bank_name", e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
                        <option value="">Select Bank</option>
                        {["Access Bank", "Zenith Bank", "GTBank", "First Bank", "UBA", "Sterling Bank", "Fidelity Bank", "FCMB", "Polaris Bank", "Barclays (UK)", "HSBC (UK)", "Chase (USA)", "Bank of America (USA)", "Deutsche Bank (DE)", "Other"].map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Input label="Account Name (as on bank statement)" value={formData.account_name} onChange={(e) => update("account_name", e.target.value)} required />
                    </div>
                    <Input label="Account Number / IBAN" value={formData.account_number} onChange={(e) => update("account_number", e.target.value)} required />
                    <Input label="Sort Code / Routing Number" value={formData.bank_code} onChange={(e) => update("bank_code", e.target.value)} placeholder="Optional" />
                    <div className="col-span-2">
                      <Input label="SWIFT/BIC Code (for international)" value={formData.swift_code} onChange={(e) => update("swift_code", e.target.value)} placeholder="e.g. GTBINGLAXXX" />
                    </div>
                  </div>
                  <DocumentUploadZone
                    label="Upload Bank Statement (3 months) *"
                    hint="Recent bank statement showing account activity"
                    onUpload={(f) => handleDocumentUpload("bank_statement", f)}
                    uploaded={uploadedDocs.bank_statement}
                    aiScore={aiScores.bank_statement}
                    loading={aiAnalyzing}
                  />
                </div>
              )}

              {/* Step 6: Review */}
              {currentStepData.id === "review" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-2xl space-y-3">
                    <h4 className="font-semibold text-sm">Application Summary</h4>
                    {[
                      { label: "Full Name", value: formData.full_name || "—" },
                      { label: "Role", value: role.charAt(0).toUpperCase() + role.slice(1) },
                      { label: "ID Type", value: formData.id_type.replace("_", " ") },
                      { label: "Business", value: formData.business_name || "N/A" },
                      { label: "Address", value: formData.city && formData.country ? `${formData.city}, ${formData.country}` : "—" },
                      { label: "Bank", value: formData.bank_name || "—" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium capitalize">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium mb-2">Uploaded Documents</div>
                    {Object.entries(uploadedDocs).map(([key, val]) => (
                      val && (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-muted-foreground capitalize">{key.replace("_", " ")}</span>
                          {aiScores[key] && (
                            <Badge variant="success" className="text-[10px] ml-auto">
                              {Math.round((aiScores[key] ?? 0) * 100)}% AI verified
                            </Badge>
                          )}
                        </div>
                      )
                    ))}
                  </div>

                  <div className="p-4 bg-ekda-green-50 dark:bg-ekda-green-900/20 rounded-2xl border border-ekda-green-200 dark:border-ekda-green-800">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-ekda-green-600 mt-0.5" />
                      <div className="text-xs text-ekda-green-700 dark:text-ekda-green-400">
                        <strong>Declaration:</strong> I confirm that all information provided is accurate and complete. I understand that providing false information may result in permanent suspension from EKDA marketplace. My documents will be reviewed within 24 hours and stored securely in compliance with NDPR and GDPR.
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 rounded" required />
                    <span className="text-sm text-muted-foreground">
                      I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{" "}
                      <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>, and consent to KYC identity verification.
                    </span>
                  </label>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <Button variant="outline" size="lg" onClick={handleBack} className="flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="lg"
          variant="premium"
          className="flex-1"
          onClick={isLastStep ? handleSubmit : handleNext}
          loading={submitting}
        >
          {isLastStep ? "Submit KYC Application" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Bot,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Truck,
  Star,
  FileText,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate, formatDateTime } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type ApplicationStatus = "all" | "pending_admin" | "ai_reviewing" | "approved" | "rejected" | "more_info_requested";
type RoleFilter = "all" | "vendor" | "carrier" | "customer" | "enterprise";

interface KYCApplication {
  id: string;
  application_number: string;
  user_id: string;
  applicant_name: string;
  applicant_email: string;
  role: "vendor" | "carrier" | "customer" | "enterprise";
  business_name?: string;
  country: string;
  status: string;
  ai_risk_score: number;
  ai_authenticity_score: number;
  ai_flags: string[];
  documents_submitted: number;
  documents_verified: number;
  submitted_at: string;
  admin_notes?: string;
}

const MOCK_APPLICATIONS: KYCApplication[] = [
  {
    id: "1", application_number: "KYC-MK8X3F", user_id: "u1",
    applicant_name: "Kingsley Okonkwo", applicant_email: "kingsley@example.com",
    role: "vendor", business_name: "Lagos Fresh Exports Ltd",
    country: "NG", status: "pending_admin",
    ai_risk_score: 92, ai_authenticity_score: 96, ai_flags: [],
    documents_submitted: 5, documents_verified: 5, submitted_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "2", application_number: "KYC-PL9Q4R", user_id: "u2",
    applicant_name: "Chen Wei", applicant_email: "chen@chinatech.com",
    role: "vendor", business_name: "Guangzhou Electronics Co.",
    country: "CN", status: "pending_admin",
    ai_risk_score: 71, ai_authenticity_score: 88,
    ai_flags: ["International vendor — additional due diligence recommended", "Business registration from non-English country"],
    documents_submitted: 4, documents_verified: 3, submitted_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "3", application_number: "KYC-TY7N1A", user_id: "u3",
    applicant_name: "Amara Logistics Ltd", applicant_email: "amara@amalog.ng",
    role: "carrier", business_name: "Amara Logistics",
    country: "NG", status: "ai_reviewing",
    ai_risk_score: 85, ai_authenticity_score: 91, ai_flags: [],
    documents_submitted: 3, documents_verified: 2, submitted_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "4", application_number: "KYC-BF2K8S", user_id: "u4",
    applicant_name: "FastTrack Freight UK", applicant_email: "info@fasttrack.co.uk",
    role: "carrier", business_name: "FastTrack International",
    country: "GB", status: "more_info_requested",
    ai_risk_score: 58, ai_authenticity_score: 74,
    ai_flags: ["Address proof document unclear", "Vehicle fleet documents missing"],
    documents_submitted: 3, documents_verified: 2, submitted_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    admin_notes: "Please provide clearer proof of address and list of vehicles",
  },
  {
    id: "5", application_number: "KYC-RT5V2Z", user_id: "u5",
    applicant_name: "Euro Auto GmbH", applicant_email: "kyc@euroauto.de",
    role: "vendor", business_name: "Euro Auto GmbH",
    country: "DE", status: "approved",
    ai_risk_score: 97, ai_authenticity_score: 99, ai_flags: [],
    documents_submitted: 5, documents_verified: 5, submitted_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    admin_notes: "All documents verified. Excellent compliance record.",
  },
];

const STATUS_CONFIG: Record<string, { label: string; variant: string; icon: typeof CheckCircle2 }> = {
  pending_admin: { label: "Pending Review", variant: "warning", icon: Clock },
  ai_reviewing: { label: "AI Reviewing", variant: "blue", icon: Bot },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "error", icon: XCircle },
  more_info_requested: { label: "More Info Needed", variant: "warning", icon: MessageSquare },
  submitted: { label: "Submitted", variant: "blue", icon: FileText },
};

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  vendor: Building2,
  carrier: Truck,
  customer: User,
  enterprise: Building2,
};

interface ApplicationDetailProps {
  application: KYCApplication;
  onAction: (id: string, action: string, notes?: string) => void;
}

function ApplicationDetail({ application, onAction }: ApplicationDetailProps) {
  const [notes, setNotes] = useState("");
  const [moreInfoText, setMoreInfoText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    await onAction(application.id, action, notes || moreInfoText);
    setLoading(null);
  };

  const riskColor = application.ai_risk_score >= 85 ? "text-green-600" : application.ai_risk_score >= 65 ? "text-yellow-600" : "text-red-500";
  const riskBg = application.ai_risk_score >= 85 ? "bg-green-50 dark:bg-green-900/20" : application.ai_risk_score >= 65 ? "bg-yellow-50 dark:bg-yellow-900/20" : "bg-red-50 dark:bg-red-900/20";

  return (
    <div className="space-y-4">
      {/* Applicant Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Applicant</div>
          <div className="font-semibold">{application.applicant_name}</div>
          <div className="text-sm text-muted-foreground">{application.applicant_email}</div>
          {application.business_name && (
            <div className="text-sm font-medium">{application.business_name}</div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] capitalize">{application.role}</Badge>
            <span className="text-xs text-muted-foreground">🌍 {application.country}</span>
          </div>
        </div>

        {/* AI Scores */}
        <div className={cn("p-3 rounded-2xl", riskBg)}>
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Bot className="h-3.5 w-3.5" />
            AI Verification Scores
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Risk Score</span>
              <span className={cn("font-bold", riskColor)}>{application.ai_risk_score}/100</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", application.ai_risk_score >= 85 ? "bg-green-500" : application.ai_risk_score >= 65 ? "bg-yellow-500" : "bg-red-500")}
                style={{ width: `${application.ai_risk_score}%` }} />
            </div>
            <div className="flex justify-between text-sm">
              <span>Authenticity</span>
              <span className="font-bold text-primary">{application.ai_authenticity_score}/100</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${application.ai_authenticity_score}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Flags */}
      {application.ai_flags.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Flags</div>
          {application.ai_flags.map((flag) => (
            <div key={flag} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-yellow-700 dark:text-yellow-400">{flag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Documents */}
      <div>
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Documents</div>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="font-bold text-green-600">{application.documents_verified}</span>
            <span className="text-muted-foreground">/{application.documents_submitted} verified</span>
          </div>
          {[...Array(application.documents_submitted)].map((_, i) => (
            <div key={i} className={cn("h-8 w-8 rounded-lg flex items-center justify-center",
              i < application.documents_verified ? "bg-green-100 dark:bg-green-900/30" : "bg-muted")}>
              <FileText className={cn("h-4 w-4", i < application.documents_verified ? "text-green-600" : "text-muted-foreground")} />
            </div>
          ))}
          <Button variant="outline" size="sm" className="ml-auto text-xs">
            <Eye className="h-3.5 w-3.5 mr-1" />
            View All Docs
          </Button>
        </div>
      </div>

      {/* Previous notes */}
      {application.admin_notes && (
        <div className="p-3 bg-muted/40 rounded-xl border border-border">
          <div className="text-xs font-medium text-muted-foreground mb-1">Previous Admin Notes</div>
          <div className="text-sm">{application.admin_notes}</div>
        </div>
      )}

      {/* Action Section */}
      {(application.status === "pending_admin" || application.status === "more_info_requested") && (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Admin Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-20 px-3 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Add notes for the applicant or internal reference..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="premium"
              size="sm"
              className="flex-1"
              onClick={() => handleAction("approve")}
              loading={loading === "approve"}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approve KYC
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              onClick={() => handleAction("request_more_info")}
              loading={loading === "request_more_info"}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Request More Info
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleAction("reject")}
              loading={loading === "reject"}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminKYCQueuePage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("pending_admin");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);

  const handleAction = async (id: string, action: string, notes?: string) => {
    try {
      const response = await fetch("/api/kyc", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: id, action, admin_notes: notes }),
      });
      const data = await response.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: data.new_status, admin_notes: notes } : app
          )
        );
        toast.success(`✅ KYC ${data.new_status} — applicant notified`);
        setExpandedId(null);
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesRole = roleFilter === "all" || app.role === roleFilter;
    const matchesSearch =
      !searchQuery ||
      app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.business_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesRole && matchesSearch;
  });

  const pendingCount = applications.filter((a) => a.status === "pending_admin").length;

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            KYC Review Queue
            {pendingCount > 0 && (
              <Badge variant="warning" className="text-xs ml-1">{pendingCount} pending</Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and approve vendor, carrier, and customer KYC applications
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {applications.filter((a) => a.status === "approved").length} approved
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            {pendingCount} pending
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            {applications.filter((a) => a.status === "rejected").length} rejected
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applicant, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="pending_admin">Pending Review</option>
          <option value="ai_reviewing">AI Reviewing</option>
          <option value="more_info_requested">More Info Needed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Roles</option>
          <option value="vendor">Vendors</option>
          <option value="carrier">Carriers</option>
          <option value="customer">Customers</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No applications found</p>
          </div>
        )}
        {filtered.map((app) => {
          const statusConf = STATUS_CONFIG[app.status];
          const RoleIcon = ROLE_ICONS[app.role] || User;
          const isExpanded = expandedId === app.id;

          return (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={cn(
                "overflow-hidden",
                app.ai_risk_score < 65 && "border-red-200 dark:border-red-800",
                app.status === "pending_admin" && "border-yellow-200 dark:border-yellow-800"
              )}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
                  >
                    {/* Role icon */}
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <RoleIcon className="h-5 w-5 text-muted-foreground" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm">{app.applicant_name}</span>
                        <Badge variant={statusConf?.variant as any} className="text-[10px]">
                          {statusConf?.label}
                        </Badge>
                        {app.ai_risk_score < 65 && (
                          <Badge variant="error" className="text-[10px]">
                            <Flag className="h-2.5 w-2.5 mr-0.5" />
                            High Risk
                          </Badge>
                        )}
                        {app.ai_flags.length > 0 && app.ai_risk_score >= 65 && (
                          <Badge variant="warning" className="text-[10px]">
                            {app.ai_flags.length} AI Flags
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {app.application_number} · {app.role} ·{" "}
                        {app.business_name || app.applicant_email} · 🌍 {app.country}
                      </div>
                    </div>

                    {/* Risk + Time */}
                    <div className="text-right hidden sm:block flex-shrink-0">
                      <div className={cn("text-sm font-bold",
                        app.ai_risk_score >= 85 ? "text-green-600" : app.ai_risk_score >= 65 ? "text-yellow-600" : "text-red-500")}>
                        {app.ai_risk_score}/100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(app.submitted_at).toLocaleDateString()}
                      </div>
                    </div>

                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border"
                      >
                        <div className="p-4">
                          <ApplicationDetail application={app} onAction={handleAction} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Filter, Shield, Ban, CheckCircle2, Flag, Trash2, Download,
  Eye, Mail, Phone, Calendar, MapPin, Package, ShoppingCart, Star, AlertTriangle,
  ChevronDown, MoreVertical, Crown, User, Building2, Truck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const USERS = [
  { id: "u1", name: "Adaeze Okonkwo", email: "adaeze@example.com", phone: "+447911123456", role: "customer", country: "🇬🇧 UK", status: "active", kyc: "approved", joined: "2024-06-15", orders: 24, gmv: 1840000, rating: 4.9, flagged: false },
  { id: "u2", name: "Kingsley Eze", email: "kingsley@lgexports.ng", phone: "+2348012345678", role: "vendor", country: "🇳🇬 Nigeria", status: "active", kyc: "approved", joined: "2024-01-10", orders: 289, gmv: 12400000, rating: 4.8, flagged: false, business: "Lagos Fresh Exports Ltd" },
  { id: "u3", name: "Chen Wei", email: "chen@chinatech.com", phone: "+8613812345678", role: "vendor", country: "🇨🇳 China", status: "active", kyc: "pending", joined: "2025-05-28", orders: 0, gmv: 0, rating: 0, flagged: true, business: "Guangzhou Electronics" },
  { id: "u4", name: "FastTrack Freight", email: "info@fasttrack.co.uk", phone: "+441234567890", role: "carrier", country: "🇬🇧 UK", status: "suspended", kyc: "more_info_requested", joined: "2025-04-01", orders: 12, gmv: 0, rating: 3.2, flagged: true, business: "FastTrack International" },
  { id: "u5", name: "Euro Auto GmbH", email: "kyc@euroauto.de", phone: "+491512345678", role: "vendor", country: "🇩🇪 Germany", status: "active", kyc: "approved", joined: "2024-11-20", orders: 47, gmv: 84600000, rating: 4.9, flagged: false, business: "Euro Auto GmbH" },
  { id: "u6", name: "Emeka Okafor", email: "emeka@example.com", phone: "+14165551234", role: "enterprise", country: "🇨🇦 Canada", status: "active", kyc: "approved", joined: "2024-08-05", orders: 18, gmv: 24800000, rating: 4.7, flagged: false },
];

const KYC_BADGE: Record<string, { label: string; variant: string }> = {
  approved: { label: "✅ Verified", variant: "success" },
  pending: { label: "⏳ Pending", variant: "warning" },
  rejected: { label: "❌ Rejected", variant: "error" },
  more_info_requested: { label: "📋 More Info", variant: "warning" },
};

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  customer: User, vendor: Building2, carrier: Truck, enterprise: Crown,
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-600",
  suspended: "text-red-600",
  pending: "text-yellow-600",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewUser, setViewUser] = useState<typeof USERS[0] | null>(null);

  const filtered = USERS.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedIds.length} users`);
    setSelectedIds([]);
  };

  const handleUserAction = (userId: string, action: string) => {
    toast.success(`User ${action} — notification sent`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            User & Account Management
          </h1>
          <p className="text-muted-foreground text-sm">Search, manage, and monitor all platform users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="carrier">Carriers</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("Verified")}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />Verify
            </Button>
            <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700" onClick={() => handleBulkAction("Suspended")}>
              <Ban className="h-3.5 w-3.5 mr-1" />Suspend
            </Button>
            <Button size="sm" variant="outline" className="border-red-400 text-red-600" onClick={() => handleBulkAction("Flagged")}>
              <Flag className="h-3.5 w-3.5 mr-1" />Flag
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 w-8">
                    <input type="checkbox" className="rounded" onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((u) => u.id) : [])} />
                  </th>
                  {["User", "Role", "Status", "KYC", "Country", "Orders / GMV", "Rating", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const RoleIcon = ROLE_ICONS[user.role] || User;
                  const kycConf = KYC_BADGE[user.kyc] || { label: user.kyc, variant: "outline" };
                  return (
                    <tr key={user.id} className={cn("border-b border-border last:border-0 hover:bg-muted/30 transition-colors", user.flagged && "bg-red-50/30 dark:bg-red-900/10")}>
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded" checked={selectedIds.includes(user.id)} onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, user.id] : selectedIds.filter((id) => id !== user.id))} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-1">
                              {user.name}
                              {user.flagged && <Flag className="h-3 w-3 text-red-500" />}
                            </div>
                            <div className="text-[10px] text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <RoleIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs capitalize">{user.role}</span>
                        </div>
                        {user.business && <div className="text-[10px] text-muted-foreground">{user.business}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold capitalize", STATUS_COLORS[user.status])}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={kycConf.variant as any} className="text-[10px]">{kycConf.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{user.country}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium">{user.orders} orders</div>
                        {user.gmv > 0 && <div className="text-[10px] text-muted-foreground">{formatCurrency(user.gmv, "NGN")}</div>}
                      </td>
                      <td className="px-4 py-3">
                        {user.rating > 0 ? (
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-ekda-gold-400 text-ekda-gold-400" />
                            <span>{user.rating}</span>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(user.joined)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setViewUser(user)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleUserAction(user.id, "messaged")}>
                            <Mail className="h-3.5 w-3.5" />
                          </Button>
                          {user.status === "active" ? (
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={() => handleUserAction(user.id, "suspended")}>
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600" onClick={() => handleUserAction(user.id, "reactivated")}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useVisitRequests, type VisitRequest } from "@/hooks/use-visit-requests";

export default function EditVisitRequestPage() {
  const router = useRouter();
  const { id } = useParams();
  const { visitRequests, updateVisitRequest, isLoading: hookLoading } = useVisitRequests();

  const [visitRequest, setVisitRequest] = useState<VisitRequest | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const initializedRef = useRef(false);

  const [formData, setFormData] = useState({
    status: "new" as VisitRequest["status"],
    admin_notes: "",
    final_datetime: "",
  });

  // Load visit request data when component mounts
  useEffect(() => {
    if (!initializedRef.current && !hookLoading && id && visitRequests.length > 0) {
      initializedRef.current = true;
      const foundRequest = visitRequests.find((v) => v.id.toString() === id.toString());
      if (foundRequest) {
        setVisitRequest(foundRequest);
        setFormData({
          status: foundRequest.status,
          admin_notes: foundRequest.admin_notes || "",
          final_datetime: foundRequest.final_datetime || "",
        });
        setIsInitializing(false);
      } else {
        alert("Visit request not found");
        router.push("/visit-requests");
      }
    } else if (!hookLoading) {
      setIsInitializing(false);
    }
  }, [hookLoading, id, visitRequests, router]);

  const handleInputChange = useCallback((field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!visitRequest) return;

    const payload: Partial<{
      status: VisitRequest["status"];
      admin_notes: string;
      final_datetime: string;
    }> = {};

    if (formData.status !== visitRequest.status) {
      payload.status = formData.status;
    }

    if (formData.admin_notes.trim()) {
      payload.admin_notes = formData.admin_notes.trim();
    }

    if (formData.final_datetime) {
      payload.final_datetime = formData.final_datetime;
    }

    const result = await updateVisitRequest(visitRequest.id, payload);

    if (result.success) {
      alert("Visit request updated successfully.");
      router.push("/visit-requests");
    } else {
      alert(result.message || "Failed to update visit request.");
    }
  }, [visitRequest, formData, updateVisitRequest, router]);

  if (hookLoading || isInitializing || !visitRequest) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#1A365D]" />
      </div>
    );
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Edit Visit Request
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Update visit request details and status
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Request Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Request Details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Request ID</Label>
                  <p className="text-lg font-semibold">#{visitRequest.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Ship</Label>
                  <p className="text-lg">{visitRequest.ship_name || `Ship #${visitRequest.ship}`}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">User</Label>
                  <p className="text-lg">{visitRequest.user_name || `User #${visitRequest.user}`}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Visit Type</Label>
                  <p className={`text-lg ${visitRequest.visit_type === "onsite" ? "text-blue-600" : "text-green-600"}`}>
                    {visitRequest.visit_type === "onsite" ? "On-site Visit" : "Virtual Visit"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Preferred Date & Time</Label>
                  <p className="text-lg">{formatDate(visitRequest.preferred_datetime)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                  <p className={`text-lg font-semibold ${
                    visitRequest.status === "new" ? "text-yellow-600" :
                    visitRequest.status === "approved" ? "text-green-600" :
                    visitRequest.status === "rejected" ? "text-red-600" :
                    "text-blue-600"
                  }`}>
                    {visitRequest.status.charAt(0).toUpperCase() + visitRequest.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
            {visitRequest.notes && (
              <div className="mt-6">
                <Label className="text-sm font-medium text-gray-600">User Notes</Label>
                <p className="mt-2 p-3 bg-gray-50 rounded-lg text-gray-700">{visitRequest.notes}</p>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Actions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="status" className="text-base font-medium">Update Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value as VisitRequest["status"])}
                  >
                    <SelectTrigger id="status" className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="final_datetime" className="text-base font-medium">Final Date & Time (Optional)</Label>
                  <Input
                    id="final_datetime"
                    type="datetime-local"
                    className="mt-2 h-12"
                    value={formData.final_datetime}
                    onChange={(e) => handleInputChange("final_datetime", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Set the confirmed date and time for the visit</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="admin_notes" className="text-base font-medium">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    placeholder="Add any notes or comments about this visit request..."
                    rows={6}
                    className="mt-2 resize-none"
                    value={formData.admin_notes}
                    onChange={(e) => handleInputChange("admin_notes", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">These notes will be visible to other admins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Update Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Status Change:</p>
                <p className="font-medium">
                  {visitRequest.status} → {formData.status}
                  {visitRequest.status === formData.status && <span className="text-gray-500"> (No change)</span>}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Final Date & Time:</p>
                <p className="font-medium">
                  {formData.final_datetime ? formatDate(formData.final_datetime) : "Not set"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Admin Notes:</p>
                <p className="font-medium">{formData.admin_notes || "No notes added"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/visit-requests")}
            className="px-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Requests
          </Button>

          <Button
            size="lg"
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-10"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

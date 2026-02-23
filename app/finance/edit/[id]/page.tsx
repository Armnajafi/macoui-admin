"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/ui/footer-admin";
import { useCountries } from "@/hooks/use-countries";
import { useFinanceProjects } from "@/hooks/use-finance-projects";
import { FINANCE_FIELD_LABELS, FINANCE_SELECT_OPTIONS, toOptionLabel } from "@/app/finance/form-options";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);
  const { countries, isLoading: countriesLoading } = useCountries();
  const { projects, updateProject, normalizeStatus } = useFinanceProjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const project = useMemo(() => projects.find((p) => p.id === projectId), [projects, projectId]);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description_rich: "",
    country: "",
    ship_type: "",
    vessel_age_years: "",
    financing_product_type: "",
    project_financed_type: "",
    amortization_profile: "",
    required_service: "",
    ltv_ratio_bucket: "",
    transaction_amount_musd: "",
    financing_rate_type: "",
    derivative_hedging_type: "",
    transaction_stage: "",
    collateral_type: "",
    tenor_bucket: "",
    status: "D" as "P" | "D" | "C",
  });

  useEffect(() => {
    if (!project) return;
    setFormData({
      title: project.title || "",
      summary: project.summary || "",
      description_rich: project.description_rich || "",
      country: project.country ? String(project.country.id) : "",
      ship_type: project.ship_type || "",
      vessel_age_years: project.vessel_age_years ? String(project.vessel_age_years) : "",
      financing_product_type: project.financing_product_type || "",
      project_financed_type: project.project_financed_type || "",
      amortization_profile: project.amortization_profile || "",
      required_service: project.required_service || "",
      ltv_ratio_bucket: project.ltv_ratio_bucket || "",
      transaction_amount_musd: project.transaction_amount_musd || "",
      financing_rate_type: project.financing_rate_type || "",
      derivative_hedging_type: project.derivative_hedging_type || "",
      transaction_stage: project.transaction_stage || "",
      collateral_type: project.collateral_type || "",
      tenor_bucket: project.tenor_bucket || "",
      status: normalizeStatus(project.status),
    });
  }, [project, normalizeStatus]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!projectId) return;

    setIsSubmitting(true);
    const result = await updateProject(projectId, {
      title: formData.title,
      summary: formData.summary,
      description_rich: formData.description_rich,
      country: Number(formData.country),
      ship_type: formData.ship_type || undefined,
      vessel_age_years: formData.vessel_age_years ? Number(formData.vessel_age_years) : null,
      financing_product_type: formData.financing_product_type || undefined,
      project_financed_type: formData.project_financed_type || undefined,
      amortization_profile: formData.amortization_profile || undefined,
      required_service: formData.required_service || undefined,
      ltv_ratio_bucket: formData.ltv_ratio_bucket || undefined,
      transaction_amount_musd: formData.transaction_amount_musd || undefined,
      financing_rate_type: formData.financing_rate_type || undefined,
      derivative_hedging_type: formData.derivative_hedging_type || undefined,
      transaction_stage: formData.transaction_stage || undefined,
      collateral_type: formData.collateral_type || undefined,
      tenor_bucket: formData.tenor_bucket || undefined,
      status: formData.status,
    });
    setIsSubmitting(false);

    if (result.success) {
      router.push("/finance");
      return;
    }
    alert(result.message);
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-6 py-12">
          <h1 className="text-4xl font-semibold text-white">Edit Finance Project #{projectId}</h1>
        </div>
      </div>

      <div className="max-w-[1226px] mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input className="mt-2 h-12" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Summary</Label>
            <Textarea className="mt-2" value={formData.summary} onChange={(e) => handleChange("summary", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Description Rich</Label>
            <Textarea className="mt-2" value={formData.description_rich} onChange={(e) => handleChange("description_rich", e.target.value)} />
          </div>

          <div>
            <Label>Country</Label>
            <Select value={formData.country} onValueChange={(v) => handleChange("country", v)} disabled={countriesLoading}>
              <SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select country" /></SelectTrigger>
              <SelectContent>{countries.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(v: "P" | "D" | "C") => handleChange("status", v)}>
              <SelectTrigger className="mt-2 h-12"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="D">Draft</SelectItem>
                <SelectItem value="P">Published</SelectItem>
                <SelectItem value="C">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(Object.keys(FINANCE_SELECT_OPTIONS) as (keyof typeof FINANCE_SELECT_OPTIONS)[])
            .filter((key) => key !== "status")
            .map((key) => (
              <div key={key}>
                <Label>{FINANCE_FIELD_LABELS[key]}</Label>
                <Select value={(formData as any)[key]} onValueChange={(value) => handleChange(key, value)}>
                  <SelectTrigger className="mt-2 h-12">
                    <SelectValue placeholder={`Select ${FINANCE_FIELD_LABELS[key]}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {FINANCE_SELECT_OPTIONS[key].map((value) => (
                      <SelectItem key={value} value={value}>
                        {toOptionLabel(value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

          <div>
            <Label>Transaction Amount (MUSD)</Label>
            <Input className="mt-2 h-12" value={formData.transaction_amount_musd} onChange={(e) => handleChange("transaction_amount_musd", e.target.value)} />
          </div>

          <div>
            <Label>Vessel Age Years</Label>
            <Input type="number" className="mt-2 h-12" value={formData.vessel_age_years} onChange={(e) => handleChange("vessel_age_years", e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="bg-[#1A365D] text-white" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTradingQuotations } from "@/hooks/use-trading-quotations"

export default function EditQuotationPage() {
  const params = useParams<{ id: string }>()
  const quotationId = Number(params.id)
  const router = useRouter()
  const { quotations, updateQuotation, isLoading } = useTradingQuotations()
  const quotation = useMemo(() => quotations.find((item) => item.id === quotationId), [quotations, quotationId])

  const [status, setStatus] = useState("quoted")
  const [quotedPrice, setQuotedPrice] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  if (!quotation) return <div className="h-screen flex items-center justify-center">Quotation not found</div>

  const onSave = async () => {
    const result = await updateQuotation(quotationId, {
      status: status as "new" | "in_review" | "quoted" | "closed",
      quoted_price: quotedPrice ? Number(quotedPrice) : undefined,
      admin_notes: adminNotes,
    })

    if (result.success) {
      alert("Quotation updated")
      router.push("/trading/quotations")
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 className="text-3xl font-semibold">Update Quotation #{quotationId}</h1>

        <div className="text-sm text-slate-600 space-y-1">
          <p><strong>Product:</strong> {quotation.product.name}</p>
          <p><strong>User:</strong> {quotation.user.full_name} ({quotation.user.email})</p>
          <p><strong>Requested qty:</strong> {quotation.desired_qty}</p>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="quoted">quoted</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Quoted price</Label>
          <Input type="number" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} placeholder="2250" />
        </div>

        <div>
          <Label>Admin notes</Label>
          <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Bulk discount applied..." />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/trading/quotations")}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

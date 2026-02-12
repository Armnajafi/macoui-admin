"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTradingCustomOrders } from "@/hooks/use-trading-custom-orders"
import { useTradingProducts } from "@/hooks/use-trading-products"

export default function EditCustomOrderPage() {
  const params = useParams<{ id: string }>()
  const customOrderId = Number(params.id)
  const router = useRouter()
  const { customOrders, updateCustomOrder, isLoading } = useTradingCustomOrders()
  const { products } = useTradingProducts()
  const customOrder = useMemo(() => customOrders.find((item) => item.id === customOrderId), [customOrders, customOrderId])

  const [status, setStatus] = useState("matched")
  const [matchedProduct, setMatchedProduct] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  if (!customOrder) return <div className="h-screen flex items-center justify-center">Custom order not found</div>

  const onSave = async () => {
    const result = await updateCustomOrder(customOrderId, {
      status: status as "new" | "in_review" | "matched" | "closed",
      matched_product: matchedProduct ? Number(matchedProduct) : undefined,
      admin_notes: adminNotes,
    })

    if (result.success) {
      alert("Custom order updated")
      router.push("/trading/custom-orders")
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 className="text-3xl font-semibold">Update Custom Order #{customOrderId}</h1>

        <div className="text-sm text-slate-600 space-y-1">
          <p><strong>User:</strong> {customOrder.user.full_name} ({customOrder.user.email})</p>
          <p><strong>Category:</strong> {customOrder.category.name}</p>
          <p><strong>Target price:</strong> {customOrder.currency} {customOrder.target_price}</p>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="matched">matched</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Matched product</Label>
          <Select value={matchedProduct} onValueChange={setMatchedProduct}>
            <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>{product.name} ({product.sku})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Admin notes</Label>
          <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Found matching product..." />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/trading/custom-orders")}>Cancel</Button>
          <Button onClick={onSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

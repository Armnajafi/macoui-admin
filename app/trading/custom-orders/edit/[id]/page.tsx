"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useTradingCustomOrders } from "@/hooks/use-trading-custom-orders"
import { useTradingProducts } from "@/hooks/use-trading-products"
import { cn } from "@/lib/utils"

export default function EditCustomOrderPage() {
  const params = useParams<{ id: string }>()
  const customOrderId = Number(params.id)
  const router = useRouter()
  const { customOrders, updateCustomOrder, isLoading } = useTradingCustomOrders()
  const { products } = useTradingProducts()
  const customOrder = useMemo(
    () => customOrders.find((item) => item.id === customOrderId),
    [customOrders, customOrderId],
  )

  const [status, setStatus] = useState("matched")
  const [matchedProduct, setMatchedProduct] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [productSearchOpen, setProductSearchOpen] = useState(false)

  useEffect(() => {
    if (!customOrder) return
    setStatus(customOrder.status)
    setAdminNotes(customOrder.admin_notes ?? "")
    setMatchedProduct(customOrder.matched_product ? String(customOrder.matched_product.id) : "")
  }, [customOrder])

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === matchedProduct),
    [products, matchedProduct],
  )

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
          <p>
            <strong>User:</strong> {customOrder.user.full_name} ({customOrder.user.email})
          </p>
          <p>
            <strong>Category:</strong> {customOrder.category.name}
          </p>
          <p>
            <strong>Target price:</strong> {customOrder.currency} {customOrder.target_price}
          </p>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">new</SelectItem>
              <SelectItem value="in_review">in_review</SelectItem>
              <SelectItem value="matched">matched</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Matched product</Label>
          <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={productSearchOpen}
                className="w-full justify-between"
              >
                {selectedProduct
                  ? `${selectedProduct.name} (${selectedProduct.sku})`
                  : "Search and select product..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder="Search by name, sku, category..." />
                <CommandList>
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={`${product.name} ${product.sku} ${product.category?.name ?? ""} ${product.seller?.full_name ?? ""}`}
                        onSelect={() => {
                          setMatchedProduct(String(product.id))
                          setProductSearchOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            matchedProduct === String(product.id) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-slate-500">
                            SKU: {product.sku} • {product.category?.name ?? "No category"} •
                            {" "}
                            {product.currency} {product.price_estimate} • {product.status}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedProduct && (
            <div className="rounded-md border bg-slate-50 px-4 py-3 text-sm text-slate-700 space-y-1">
              <p>
                <strong>Seller:</strong> {selectedProduct.seller?.full_name ?? "-"}
              </p>
              <p>
                <strong>Country:</strong> {selectedProduct.country_of_origin?.name ?? "-"}
              </p>
              <p>
                <strong>Quotation count:</strong> {selectedProduct.quotation_count}
              </p>
            </div>
          )}
        </div>

        <div>
          <Label>Admin notes</Label>
          <Textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Found matching product..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/trading/custom-orders")}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}

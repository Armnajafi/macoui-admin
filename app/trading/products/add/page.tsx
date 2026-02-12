"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useCountries } from "@/hooks/use-countries"
import { useTradingCategories } from "@/hooks/use-trading-categories"
import { useTradingProducts } from "@/hooks/use-trading-products"

const parseSpecs = (raw: string) => {
  const specs: Record<string, string> = {}
  raw.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":")
    if (!key || !rest.length) return
    specs[key.trim()] = rest.join(":").trim()
  })
  return specs
}

const parseDocs = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, url] = line.split("|")
      return { title: title?.trim(), url: url?.trim() }
    })
    .filter((doc) => doc.title && doc.url) as { title: string; url: string }[]

export default function AddTradingProductPage() {
  const router = useRouter()
  const { countries } = useCountries()
  const { categories, createCategory } = useTradingCategories()
  const { createProduct } = useTradingProducts()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    country: "",
    price: "",
    currency: "USD",
    status: "available",
    description: "",
    isFeatured: false,
    images: "",
    docs: "",
    specs: "",
  })
  const [newCategoryName, setNewCategoryName] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await createProduct({
      name: form.name,
      sku: form.sku,
      category: Number(form.category),
      country_of_origin: Number(form.country),
      price_estimate: Number(form.price || 0),
      currency: form.currency,
      status: form.status,
      description: form.description,
      is_featured: form.isFeatured,
      images: form.images.split(",").map((url) => url.trim()).filter(Boolean),
      docs: parseDocs(form.docs),
      specs: parseSpecs(form.specs),
    })
    setIsLoading(false)

    if (!result.success) return alert(result.message)
    alert("Product created successfully")
    router.push("/trading/products")
  }

  const handleQuickCategoryCreate = async () => {
    if (!newCategoryName.trim()) return
    const slug = newCategoryName.toLowerCase().replace(/\s+/g, "-")
    const result = await createCategory({ name: newCategoryName, slug })
    if (result.success) {
      setNewCategoryName("")
      alert("Category created")
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8">
        <h1 className="text-3xl font-semibold">Add Trading Product</h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} required /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map((cat) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Country of origin</Label>
              <Select value={form.country} onValueChange={(v) => setForm((p) => ({ ...p, country: v }))}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>{countries.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Price estimate</Label><Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /></div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["USD", "EUR", "AED", "SAR"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["available", "unavailable", "discontinued"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3"><Switch checked={form.isFeatured} onCheckedChange={(v) => setForm((p) => ({ ...p, isFeatured: v }))} /><Label>Featured product</Label></div>
          </div>

          <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></div>
          <div><Label>Images URLs (comma separated)</Label><Textarea value={form.images} onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))} /></div>
          <div><Label>Docs (title|url per line)</Label><Textarea value={form.docs} onChange={(e) => setForm((p) => ({ ...p, docs: e.target.value }))} /></div>
          <div><Label>Specs (key:value per line)</Label><Textarea value={form.specs} onChange={(e) => setForm((p) => ({ ...p, specs: e.target.value }))} /></div>

          <div className="border-t pt-6">
            <Label>Quick create category</Label>
            <div className="flex gap-3 mt-2">
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" />
              <Button type="button" variant="outline" onClick={handleQuickCategoryCreate}>Create Category</Button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/trading/products")}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Create Product</>}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useTradingProducts } from "@/hooks/use-trading-products"
import { useTradingCategories } from "@/hooks/use-trading-categories"
import { useTradingFileUploads } from "@/hooks/use-trading-files"

export default function EditTradingProductPage() {
  const params = useParams<{ id: string }>()
  const productId = Number(params.id)
  const router = useRouter()
  const { products, updateProduct, isLoading } = useTradingProducts()
  const { categories, updateCategory } = useTradingCategories()
  const { uploadProductImage, uploadProductDocument } = useTradingFileUploads()

  const product = useMemo(() => products.find((p) => p.id === productId), [products, productId])
  const [form, setForm] = useState({
    name: product?.name ?? "",
    price: product?.price_estimate?.toString() ?? "",
    status: product?.status ?? "available",
    isFeatured: Boolean(product?.is_featured),
  })
  const [adminNotes, setAdminNotes] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [imageTitle, setImageTitle] = useState("")
  const [docTitle, setDocTitle] = useState("")
  const [docType, setDocType] = useState("pdf")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>

  const saveChanges = async () => {
    const result = await updateProduct(productId, {
      name: form.name,
      price_estimate: Number(form.price || 0),
      status: form.status,
      is_featured: form.isFeatured,
      description: adminNotes || undefined,
    })
    if (result.success) {
      alert("Product updated")
      router.push("/trading/products")
    } else {
      alert(result.message)
    }
  }

  const submitCategoryUpdate = async () => {
    if (!categoryId) return
    const result = await updateCategory(Number(categoryId), { name: categoryName })
    if (result.success) alert("Category updated")
    else alert(result.message)
  }

  const submitImageUpload = async () => {
    if (!imageFile) return
    const result = await uploadProductImage(productId, imageFile, imageTitle || "Product image")
    if (result.success) alert("Image uploaded")
    else alert(result.message)
  }

  const submitDocUpload = async () => {
    if (!docFile) return
    const result = await uploadProductDocument(productId, docFile, docTitle || "Product document", docType)
    if (result.success) alert("Document uploaded")
    else alert(result.message)
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8">
        <h1 className="text-3xl font-semibold">Edit Trading Product #{productId}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
          <div><Label>Price estimate</Label><Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} /></div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["available", "unavailable", "discontinued"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Featured</Label>
            <Select value={form.isFeatured ? "yes" : "no"} onValueChange={(v) => setForm((p) => ({ ...p, isFeatured: v === "yes" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
            </Select>
          </div>
        </div>

        <div><Label>Admin notes</Label><Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} /></div>

        <div className="flex justify-end"><Button onClick={saveChanges}>Save Product Changes</Button></div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">Category update</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map((cat) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category name" />
          </div>
          <Button variant="outline" onClick={submitCategoryUpdate}>Update Category</Button>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-xl font-semibold">File uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Image title</Label>
              <Input value={imageTitle} onChange={(e) => setImageTitle(e.target.value)} />
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              <Button variant="outline" onClick={submitImageUpload}><Upload className="w-4 h-4 mr-2" />Upload image</Button>
            </div>
            <div className="space-y-3">
              <Label>Document title</Label>
              <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
              <Label>Document type</Label>
              <Input value={docType} onChange={(e) => setDocType(e.target.value)} />
              <Input type="file" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
              <Button variant="outline" onClick={submitDocUpload}><Upload className="w-4 h-4 mr-2" />Upload document</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end"><Button variant="ghost" onClick={() => router.push("/trading/products")}>Back to products</Button></div>
      </div>
    </div>
  )
}

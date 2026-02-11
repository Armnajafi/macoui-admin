"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MobileSearchBar } from "@/components/common/mobile-search-bar"
import { MobileListView } from "@/components/common/mobile-list-view"
import { StatsCard } from "@/components/common/stats-card"
import { DataTable, type TableColumn } from "@/components/common/data-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/theme-context"
import { useCountries } from "@/hooks/use-countries"
import {
  useTradingProducts,
  type TradingProduct,
} from "@/hooks/use-trading-products"
import { useTradingQuotations } from "@/hooks/use-trading-quotations"
import { useTradingCustomOrders } from "@/hooks/use-trading-custom-orders"
import { useTradingCategories } from "@/hooks/use-trading-categories"
import { useTradingFileUploads } from "@/hooks/use-trading-files"

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

const currencyOptions = ["USD", "EUR", "AED", "SAR"]
const productStatuses = ["available", "unavailable", "discontinued"]
const quotationStatuses = ["new", "in_review", "quoted", "closed"]
const customOrderStatuses = ["new", "in_review", "matched", "closed"]

const initialProductForm = {
  name: "",
  sku: "",
  categoryId: "",
  countryId: "",
  priceEstimate: "",
  currency: "USD",
  status: "available",
  description: "",
  isFeatured: false,
  imageList: "",
  docs: "",
  specs: "",
}

const buildSpecsObject = (raw: string) => {
  const specs: Record<string, string> = {}
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(":")
      if (!key) return
      specs[key.trim()] = rest.join(":").trim()
    })
  return specs
}

const buildDocsArray = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, url] = line.split("|")
      return { title: title?.trim() ?? "", url: url?.trim() ?? "" }
    })
    .filter((doc) => doc.title && doc.url)

export default function TradingManagementPage() {
  const { theme } = useTheme()
  const { countries, isLoading: countriesLoading } = useCountries()
  const {
    products,
    stats: productStats,
    count: productCount,
    isLoading: productsLoading,
    isError: productsError,
    deleteProduct,
    createProduct,
    updateProduct,
  } = useTradingProducts()
  const {
    quotations,
    stats: quotationStats,
    count: quotationCount,
    updateQuotation,
  } = useTradingQuotations()
  const {
    customOrders,
    stats: customOrderStats,
    count: customOrderCount,
    updateCustomOrder,
  } = useTradingCustomOrders()
  const { categories, createCategory, updateCategory } = useTradingCategories()
  const { uploadProductImage, uploadProductDocument } = useTradingFileUploads()
  const [productForm, setProductForm] = useState(initialProductForm)
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")
  const [updatePrice, setUpdatePrice] = useState("")
  const [updateStatus, setUpdateStatus] = useState("available")
  const [updateFeatured, setUpdateFeatured] = useState(false)
  const [quotationForm, setQuotationForm] = useState({
    id: "",
    status: "quoted",
    quotedPrice: "",
    adminNotes: "",
  })
  const [customOrderForm, setCustomOrderForm] = useState({
    id: "",
    status: "matched",
    matchedProductId: "",
    adminNotes: "",
  })
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
  })
  const [categoryUpdateId, setCategoryUpdateId] = useState("")
  const [categoryUpdateName, setCategoryUpdateName] = useState("")
  const [categoryUpdateDescription, setCategoryUpdateDescription] = useState("")
  const [filesForm, setFilesForm] = useState({
    imageProductId: "",
    docProductId: "",
    imageTitle: "",
    docTitle: "",
    docType: "pdf",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingDoc, setIsUploadingDoc] = useState(false)
  const cardBg = theme === "dark" ? "bg-transparent lg:bg-[#0F2A48]" : "bg-transparent lg:bg-white"

  const productColumns: TableColumn<TradingProduct>[] = [
    {
      key: "id",
      header: "ID",
      render: (product) => `#${product.id}`,
    },
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      render: (product) => product.sku,
    },
    {
      key: "seller",
      header: "Seller",
      render: (product) => product.seller?.full_name ?? "-",
    },
    {
      key: "category",
      header: "Category",
      render: (product) => product.category?.name ?? "-",
    },
    {
      key: "price",
      header: "Price",
      render: (product) => `${product.currency} ${product.price_estimate.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (product) => product.status,
    },
    {
      key: "requested",
      header: "Quotations",
      render: (product) => product.quotation_count,
    },
    {
      key: "created_at",
      header: "Created",
      render: (product) => formatDate(product.created_at),
    },
  ]

  const mobileListItems = products.map((product) => ({
    id: product.id,
    title: product.name,
    subtitle: product.sku,
    meta: [product.category?.name ?? "No category", `${product.currency} ${product.price_estimate.toLocaleString()}`],
    createdBy: product.seller?.full_name ?? "Admin",
    status: product.status,
  }))

  const scrollToCreate = () => {
    if (typeof window === "undefined") return
    document.getElementById("create-product")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCreateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!productForm.name || !productForm.sku || !productForm.categoryId || !productForm.countryId) {
      alert("Name, SKU, category, and origin country are required")
      return
    }
    setIsCreatingProduct(true)
    const payload: Record<string, unknown> = {
      name: productForm.name,
      sku: productForm.sku,
      category: Number(productForm.categoryId),
      country_of_origin: Number(productForm.countryId),
      price_estimate: Number(productForm.priceEstimate || 0),
      currency: productForm.currency,
      status: productForm.status,
      description: productForm.description,
      is_featured: productForm.isFeatured,
      images: productForm.imageList
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    }

    const docs = buildDocsArray(productForm.docs)
    if (docs.length) {
      payload.docs = docs
    }

    const specs = buildSpecsObject(productForm.specs)
    if (Object.keys(specs).length) {
      payload.specs = specs
    }

    const result = await createProduct(payload as any)
    setIsCreatingProduct(false)

    if (result.success) {
      alert("Product created successfully")
      setProductForm(initialProductForm)
    } else {
      alert(result.message)
    }
  }

  const handleProductSelection = (value: string) => {
    setSelectedProductId(value)
    const match = products.find((product) => product.id === Number(value))
    if (match) {
      setUpdatePrice(match.price_estimate.toString())
      setUpdateStatus(match.status)
      setUpdateFeatured(match.is_featured)
    } else {
      setUpdatePrice("")
      setUpdateStatus("available")
      setUpdateFeatured(false)
    }
  }

  const handleUpdateProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedProductId) {
      alert("Select a product to update")
      return
    }
    const payload: Record<string, unknown> = {
      status: updateStatus,
      is_featured: updateFeatured,
    }
    if (updatePrice) {
      payload.price_estimate = Number(updatePrice)
    }
    const result = await updateProduct(Number(selectedProductId), payload)
    if (result.success) {
      alert("Product updated")
    } else {
      alert(result.message)
    }
  }

  const handleUpdateQuotation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!quotationForm.id) {
      alert("Select a quotation")
      return
    }
    const payload: Record<string, unknown> = {
      status: quotationForm.status,
      admin_notes: quotationForm.adminNotes,
    }
    if (quotationForm.quotedPrice) {
      payload.quoted_price = Number(quotationForm.quotedPrice)
    }
    const result = await updateQuotation(Number(quotationForm.id), payload as any)
    if (result.success) {
      alert("Quotation updated")
      setQuotationForm((prev) => ({ ...prev, quotedPrice: "" }))
    } else {
      alert(result.message)
    }
  }

  const handleUpdateCustomOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!customOrderForm.id) {
      alert("Select a custom order")
      return
    }
    const payload: Record<string, unknown> = {
      status: customOrderForm.status,
      admin_notes: customOrderForm.adminNotes,
    }
    if (customOrderForm.matchedProductId) {
      payload.matched_product = Number(customOrderForm.matchedProductId)
    }
    const result = await updateCustomOrder(Number(customOrderForm.id), payload as any)
    if (result.success) {
      alert("Custom order updated")
    } else {
      alert(result.message)
    }
  }

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!categoryForm.name || !categoryForm.slug) {
      alert("Category name and slug are required")
      return
    }
    const payload = {
      name: categoryForm.name,
      slug: categoryForm.slug,
      parent: categoryForm.parentId ? Number(categoryForm.parentId) : null,
      description: categoryForm.description,
    }
    const result = await createCategory(payload)
    if (result.success) {
      alert("Category created")
      setCategoryForm({ name: "", slug: "", parentId: "", description: "" })
    } else {
      alert(result.message)
    }
  }

  const handleCategorySelection = (value: string) => {
    setCategoryUpdateId(value)
    const match = categories.find((category) => category.id === Number(value))
    setCategoryUpdateName(match?.name ?? "")
    setCategoryUpdateDescription(match?.description ?? "")
  }

  const handleUpdateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!categoryUpdateId) {
      alert("Select a category to update")
      return
    }
    const result = await updateCategory(Number(categoryUpdateId), {
      name: categoryUpdateName,
      description: categoryUpdateDescription,
    })
    if (result.success) {
      alert("Category updated")
    } else {
      alert(result.message)
    }
  }

  const handleUploadImage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!filesForm.imageProductId || !imageFile || !filesForm.imageTitle) {
      alert("Select product, image, and title")
      return
    }
    setIsUploadingImage(true)
    const result = await uploadProductImage(Number(filesForm.imageProductId), imageFile, filesForm.imageTitle)
    setIsUploadingImage(false)
    if (result.success) {
      alert("Image uploaded")
      setFilesForm((prev) => ({ ...prev, imageTitle: "" }))
      setImageFile(null)
    } else {
      alert(result.message)
    }
  }

  const handleUploadDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!filesForm.docProductId || !docFile || !filesForm.docTitle) {
      alert("Select product, document, and title")
      return
    }
    setIsUploadingDoc(true)
    const result = await uploadProductDocument(
      Number(filesForm.docProductId),
      docFile,
      filesForm.docTitle,
      filesForm.docType,
    )
    setIsUploadingDoc(false)
    if (result.success) {
      alert("Document uploaded")
      setFilesForm((prev) => ({ ...prev, docTitle: "" }))
      setDocFile(null)
    } else {
      alert(result.message)
    }
  }

  const handleDeleteProduct = (product: TradingProduct) => {
    deleteProduct(product.id)
  }

  if (productsLoading) {
    return (
      <DashboardLayout title="Trading Management" wave>
        <div className="flex items-center justify-center h-96 text-lg">
          <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading trading data...
        </div>
      </DashboardLayout>
    )
  }

  if (productsError) {
    return (
      <DashboardLayout title="Trading Management" wave>
        <div className="flex items-center justify-center h-96 text-red-500">Failed to load trading catalog</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Trading Management" wave>
      <MobileSearchBar />

      <div className="space-y-6 py-6">
        <Card className={`${cardBg} border-0 shadow-sm`}>
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard title="Total Products" value={productCount} />
            <StatsCard title="Total Quotations" value={quotationCount} />
            <StatsCard title="Custom Orders" value={customOrderCount} />
          </div>
          <div className="grid gap-4 mt-6 sm:grid-cols-3">
            <StatsCard title="Available" value={productStats.available} variant="compact" />
            <StatsCard title="Unavailable" value={productStats.unavailable} variant="compact" />
            <StatsCard title="Discontinued" value={productStats.discontinued} variant="compact" />
          </div>
          <div className="grid gap-4 mt-6 sm:grid-cols-3">
            <StatsCard title="Quotations Ready" value={quotationStats.quoted} variant="compact" />
            <StatsCard title="Review" value={quotationStats.in_review} variant="compact" />
            <StatsCard title="New Orders" value={customOrderStats.new} variant="compact" />
          </div>
        </Card>

        <Card className={`${cardBg} border-0 shadow-md`}>
          <div className="flex flex-col gap-3 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Products</p>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Trading Catalog</h1>
            </div>
            <Button onClick={scrollToCreate} variant="secondary" className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </div>

          <div className="hidden md:block">
            <DataTable data={products} columns={productColumns} onDelete={handleDeleteProduct} />
          </div>
          <div className="md:hidden">
            <MobileListView
              items={mobileListItems}
              onDelete={(item) => deleteProduct(Number(item.id))}
            />
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card id="create-product" className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Products</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Create product</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleCreateProduct}>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={productForm.name}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Marine Radar System"
                  />
                </div>
                <div>
                  <Label>SKU</Label>
                  <Input
                    value={productForm.sku}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, sku: event.target.value }))}
                    placeholder="RADAR-001"
                  />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={productForm.categoryId}
                    onValueChange={(value) => setProductForm((prev) => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Country of origin</Label>
                  <Select
                    value={productForm.countryId}
                    onValueChange={(value) => setProductForm((prev) => ({ ...prev, countryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={countriesLoading ? "Loading countries" : "Select country"} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Price estimate</Label>
                  <Input
                    type="number"
                    value={productForm.priceEstimate}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, priceEstimate: event.target.value }))}
                    placeholder="15000"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={productForm.currency}
                    onValueChange={(value) => setProductForm((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={productForm.status} onValueChange={(value) => setProductForm((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {productStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={productForm.description}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Professional marine radar system..."
                />
              </div>
              <div>
                <Label>Images (comma separated URLs)</Label>
                <Input
                  value={productForm.imageList}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, imageList: event.target.value }))}
                  placeholder="https://example.com/images/radar1.jpg"
                />
              </div>
              <div>
                <Label>Documents (title|url per line)</Label>
                <Textarea
                  value={productForm.docs}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, docs: event.target.value }))}
                  placeholder="Installation Guide|https://example.com/docs/radar.pdf"
                />
              </div>
              <div>
                <Label>Specs (key:value per line)</Label>
                <Textarea
                  value={productForm.specs}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, specs: event.target.value }))}
                  placeholder="range:96 nautical miles"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={productForm.isFeatured}
                  onCheckedChange={(checked) => setProductForm((prev) => ({ ...prev, isFeatured: checked }))}
                />
                <span className="text-sm">Mark as featured</span>
              </div>
              <Button type="submit" className="w-full" disabled={isCreatingProduct}>
                {isCreatingProduct ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />}
                Create product
              </Button>
            </form>
          </Card>

          <Card className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Products</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Update product</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleUpdateProduct}>
              <div>
                <Label>Select product</Label>
                <Select value={selectedProductId} onValueChange={handleProductSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Price estimate</Label>
                  <Input
                    type="number"
                    value={updatePrice}
                    onChange={(event) => setUpdatePrice(event.target.value)}
                    placeholder="18000"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={updateStatus} onValueChange={(value) => setUpdateStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {productStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={updateFeatured} onCheckedChange={(checked) => setUpdateFeatured(checked)} />
                <span className="text-sm">Featured</span>
              </div>
              <Button type="submit" className="w-full">
                Update product
              </Button>
            </form>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quotations</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Update request</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleUpdateQuotation}>
              <div>
                <Label>Quotation</Label>
                <Select value={quotationForm.id} onValueChange={(value) => setQuotationForm((prev) => ({ ...prev, id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    {quotations.map((quotation) => (
                      <SelectItem key={quotation.id} value={quotation.id.toString()}>
                        {quotation.user.full_name} • {quotation.product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={quotationForm.status}
                  onValueChange={(value) => setQuotationForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {quotationStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quoted price</Label>
                <Input
                  type="number"
                  value={quotationForm.quotedPrice}
                  onChange={(event) => setQuotationForm((prev) => ({ ...prev, quotedPrice: event.target.value }))}
                />
              </div>
              <div>
                <Label>Admin notes</Label>
                <Textarea
                  value={quotationForm.adminNotes}
                  onChange={(event) => setQuotationForm((prev) => ({ ...prev, adminNotes: event.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">
                Submit quotation update
              </Button>
            </form>
          </Card>

          <Card className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Custom orders</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Manage order</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleUpdateCustomOrder}>
              <div>
                <Label>Order</Label>
                <Select value={customOrderForm.id} onValueChange={(value) => setCustomOrderForm((prev) => ({ ...prev, id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose order" />
                  </SelectTrigger>
                  <SelectContent>
                    {customOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        {order.user.full_name} • {order.category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={customOrderForm.status}
                  onValueChange={(value) => setCustomOrderForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {customOrderStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Matched product (ID)</Label>
                <Input
                  type="number"
                  value={customOrderForm.matchedProductId}
                  onChange={(event) => setCustomOrderForm((prev) => ({ ...prev, matchedProductId: event.target.value }))}
                />
              </div>
              <div>
                <Label>Admin notes</Label>
                <Textarea
                  value={customOrderForm.adminNotes}
                  onChange={(event) => setCustomOrderForm((prev) => ({ ...prev, adminNotes: event.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">
                Apply order update
              </Button>
            </form>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Manage categories</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleCreateCategory}>
              <div>
                <Label>Name</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={categoryForm.slug}
                  onChange={(event) => setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))}
                />
              </div>
              <div>
                <Label>Parent category</Label>
                <Select
                  value={categoryForm.parentId}
                  onValueChange={(value) => setCategoryForm((prev) => ({ ...prev, parentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={"category.id.toString()"}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">
                Create category
              </Button>
            </form>
            <form className="space-y-4 mt-6" onSubmit={handleUpdateCategory}>
            <div>
  <Label>Existing category</Label>
  <Select 
    value={categoryUpdateId} 
    onValueChange={handleCategorySelection}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category) => (
        <SelectItem 
          key={category.id} 
          value={category.id.toString()} 
        >
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
              <div>
                <Label>New name</Label>
                <Input value={categoryUpdateName} onChange={(event) => setCategoryUpdateName(event.target.value)} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={categoryUpdateDescription}
                  onChange={(event) => setCategoryUpdateDescription(event.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Update category
              </Button>
            </form>
          </Card>

          <Card className={`${cardBg} border-0 shadow-sm`}>
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Files</p>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upload assets</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleUploadImage}>
              <div>
                <Label>Product</Label>
                <Select
                  value={filesForm.imageProductId}
                  onValueChange={(value) => setFilesForm((prev) => ({ ...prev, imageProductId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Image title</Label>
                <Input
                  value={filesForm.imageTitle}
                  onChange={(event) => setFilesForm((prev) => ({ ...prev, imageTitle: event.target.value }))}
                />
              </div>
              <div>
                <Label>Image file</Label>
                <Input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} />
              </div>
              <Button type="submit" className="w-full" disabled={isUploadingImage}>
                {isUploadingImage ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Upload image"}
              </Button>
            </form>
            <form className="space-y-4 mt-6" onSubmit={handleUploadDocument}>
              <div>
                <Label>Product</Label>
                <Select
                  value={filesForm.docProductId}
                  onValueChange={(value) => setFilesForm((prev) => ({ ...prev, docProductId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Document title</Label>
                <Input
                  value={filesForm.docTitle}
                  onChange={(event) => setFilesForm((prev) => ({ ...prev, docTitle: event.target.value }))}
                />
              </div>
              <div>
                <Label>File type</Label>
                <Select
                  value={filesForm.docType}
                  onValueChange={(value) => setFilesForm((prev) => ({ ...prev, docType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="xlsx">XLSX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Document file</Label>
                <Input type="file" accept=".pdf,.doc,.docx,.xlsx" onChange={(event) => setDocFile(event.target.files?.[0] ?? null)} />
              </div>
              <Button type="submit" className="w-full" disabled={isUploadingDoc}>
                {isUploadingDoc ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Upload document"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

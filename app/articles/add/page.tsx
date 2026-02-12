"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CkEditor } from "@/components/ui/ckeditor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useArticles, type ArticleCategory } from "@/hooks/use-articles"

const categoryOptions: ArticleCategory[] = ["finance", "trading", "consultancy", "general"]

export default function AddArticlePage() {
  const router = useRouter()
  const { createArticle } = useArticles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    category: "finance" as ArticleCategory,
    cover_image: null as File | null,
    lang: "en",
    project: "",
    is_published: false,
  })

  const onChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.summary.trim() || !formData.body.trim()) {
      alert("Title, summary and body are required.")
      return
    }

    setIsSubmitting(true)
    const result = await createArticle({
      title: formData.title,
      summary: formData.summary,
      body: formData.body,
      category: formData.category,
      cover_image: formData.cover_image,
      lang: formData.lang,
      project: formData.project ? Number(formData.project) : null,
      is_published: formData.is_published,
    })
    setIsSubmitting(false)

    if (!result.success) {
      alert(result.message)
      return
    }

    router.push("/articles")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Create Article</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-5">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={(e) => onChange("title", e.target.value)} />
        </div>

        <div>
          <Label htmlFor="summary">Summary *</Label>
          <Textarea id="summary" rows={3} value={formData.summary} onChange={(e) => onChange("summary", e.target.value)} />
        </div>

        <div>
          <Label htmlFor="body">Body *</Label>
          <CkEditor id="body" value={formData.body} onChange={(value) => onChange("body", value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => onChange("category", value)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="lang">Language</Label>
            <Input id="lang" value={formData.lang} onChange={(e) => onChange("lang", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="project">Project ID (optional)</Label>
            <Input id="project" value={formData.project} onChange={(e) => onChange("project", e.target.value)} />
          </div>

          <div>
            <Label htmlFor="cover_image">Cover Image File (optional)</Label>
            <Input id="cover_image" type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => onChange("cover_image", e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_published"
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => onChange("is_published", e.target.checked)}
          />
          <Label htmlFor="is_published">Publish now</Label>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/articles")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </Button>
        </div>
      </form>
    </div>
  )
}

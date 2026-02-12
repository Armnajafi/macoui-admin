"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useArticleDetail, useArticles, type ArticleCategory } from "@/hooks/use-articles"

const categoryOptions: ArticleCategory[] = ["finance", "trading", "consultancy", "general"]

export default function EditArticlePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { article, isLoading } = useArticleDetail(params.id)
  const { updateArticle } = useArticles()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    body: "",
    category: "finance" as ArticleCategory,
    cover_image: "",
    lang: "en",
    project: "",
    is_published: false,
  })

  useEffect(() => {
    if (!article) return
    setFormData({
      title: article.title,
      summary: article.summary,
      body: article.body,
      category: (article.category as ArticleCategory) || "finance",
      cover_image: article.cover_image || "",
      lang: article.lang,
      project: article.project ? String(article.project) : "",
      is_published: article.is_published,
    })
  }, [article])

  const onChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!params.id) return

    setIsSubmitting(true)
    const result = await updateArticle(Number(params.id), {
      title: formData.title,
      summary: formData.summary,
      body: formData.body,
      category: formData.category,
      cover_image: formData.cover_image || null,
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

  if (isLoading) return <div className="p-8">Loading article...</div>
  if (!article) return <div className="p-8">Article not found.</div>

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Edit Article</h1>

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
          <Textarea id="body" rows={8} value={formData.body} onChange={(e) => onChange("body", e.target.value)} />
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
            <Label htmlFor="cover_image">Cover Image URL (optional)</Label>
            <Input id="cover_image" value={formData.cover_image} onChange={(e) => onChange("cover_image", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="is_published"
            type="checkbox"
            checked={formData.is_published}
            onChange={(e) => onChange("is_published", e.target.checked)}
          />
          <Label htmlFor="is_published">Published</Label>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/articles")}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

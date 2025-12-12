"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Save, Loader2 } from "lucide-react";
import Footer from "@/components/ui/footer-admin";
import { useArticles, type Article } from "@/hooks/use-articles";

// تعریف نوع برای داده‌های فرم
interface ArticleFormData {
  title: string;
  category: string;
  author: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  tags: string[];
  visibility: "Public" | "Private" | "Premium";
  thumbnail: string | null;
  status: "Published" | "Draft" | "Pending" | string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const { articles, editArticle } = useArticles();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // پیدا کردن مقاله برای ویرایش
  const currentArticle = articles.find(article => article.id === parseInt(articleId));
  
  // داده‌های فرم
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    category: "",
    author: "",
    content: "",
    seoTitle: "",
    metaDescription: "",
    tags: [],
    visibility: "Public",
    thumbnail: null,
    status: "Draft",
  });

  // پر کردن فرم با داده‌های مقاله هنگام لود اولیه
  useEffect(() => {
    if (currentArticle && !isInitialized) {
      setFormData({
        title: currentArticle.title || "",
        category: currentArticle.category || "",
        author: currentArticle.author || "",
        content: currentArticle.content || "",
        seoTitle: currentArticle.title || "", // از title به عنوان SEO Title پیش‌فرض
        metaDescription: currentArticle.summary || "",
        tags: currentArticle.tags || [],
        visibility: "Public", // این فیلد در دیتا نیست، پیش‌فرض می‌گذاریم
        thumbnail: currentArticle.thumbnail,
        status: currentArticle.status || "Draft",
      });
      setIsInitialized(true);
    }
  }, [currentArticle, isInitialized]);

  const steps = [
    { id: 1, name: "Article Info" },
    { id: 2, name: "SEO & Settings" },
    { id: 3, name: "Media Upload" },
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagsChange = (value: string) => {
    const tagsArray = value.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
    handleInputChange("tags", tagsArray);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      
      // شبیه‌سازی آپلود فایل
      setTimeout(() => {
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          handleInputChange("thumbnail", reader.result as string);
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      alert("Please enter article title");
      return false;
    }
    if (!formData.category) {
      alert("Please select a category");
      return false;
    }
    if (!formData.author) {
      alert("Please select an author");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    if (currentStep === 3) {
      // اگر در مرحله آخر هستیم، مقاله را ذخیره کامل کنیم
      await handleSubmit();
    } else {
      // در غیر این صورت فقط رفتن به مرحله بعد
      nextStep();
    }
  };

  const handleSubmit = async () => {
    // اعتبارسنجی نهایی
    if (!validateStep1()) {
      return;
    }

    if (!formData.thumbnail) {
      const confirmUpload = window.confirm("You haven't uploaded a cover image. Continue without cover image?");
      if (!confirmUpload) return;
    }

    setIsLoading(true);
    
    try {
      // آماده کردن داده‌ها برای API - فقط فیلدهای قابل ویرایش
      const updateData: Partial<Article> = {
        title: formData.title,
        category: formData.category,
        author: formData.author,
        status: formData.status,
        content: formData.content || "",
        thumbnail: formData.thumbnail,
        tags: formData.tags,
        summary: formData.metaDescription, // استفاده از metaDescription به عنوان summary
      };

      // استفاده از تابع editArticle از هوک
      await editArticle(parseInt(articleId), updateData);
      
      alert("Article updated successfully!");
      // هدایت به صفحه لیست مقالات
      router.push("/articles");
      
    } catch (error: any) {
      console.error("Error updating article:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  // اگر مقاله پیدا نشد
  if (!currentArticle && isInitialized) {
    return (
      <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you are trying to edit does not exist.</p>
          <Button onClick={() => router.push("/articles")}>
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      {/* Header */}
      <div className="w-full bg-[#1A365D] shadow-lg">
        <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-[77px]">
          <h2 className="text-xl sm:text-2xl md:text-[44px] font-semibold text-white mb-2">
            Edit Article
          </h2>
          <p className="text-sm sm:text-xl md:text-[28px] text-white opacity-90">
            Edit "{currentArticle?.title || 'Article'}"
          </p>
        </div>
      </div>

      {/* Progress + Form */}
      <div className="max-w-[1226px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* نوار پیشرفت */}
        <div className="mb-16">
          <div className="relative max-w-3xl mx-auto">
            {/* خط پس‌زمینه خاکستری */}
            <div className="absolute inset-x-0 top-12 h-px bg-gray-300 -translate-y-1/2" />

            {/* خط پیشرفت آبی تیره */}
            <div
              className="absolute top-12 left-0 h-px bg-[#1A365D] transition-all duration-500 ease-in-out -translate-y-1/2 origin-left rounded-r-full"
              style={{ width: `${progressPercentage}%` }}
            />

            {/* متن مراحل */}
            <div className="relative flex justify-between items-center">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? "text-[#1A365D] font-semibold"
                      : "text-gray-400 font-medium"
                  }`}
                >
                  <span className="text-lg">
                    {step.id}/ {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* فرم */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-12">
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">Article Information</h3>

              <div className="space-y-8 max-w-2xl">
                {/* Article Title */}
                <div>
                  <Label htmlFor="title" className="text-base font-medium">Article Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter article title here..." 
                    className="mt-2 h-12"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-base font-medium">Category *</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger id="category" className="mt-2 h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regulations">Regulations</SelectItem>
                      <SelectItem value="Interviews">Interviews</SelectItem>
                      <SelectItem value="Analysis">Analysis</SelectItem>
                      <SelectItem value="Tutorials">Tutorials</SelectItem>
                      <SelectItem value="Industry">Industry Insights</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Case-Studies">Case Studies</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Author */}
                <div>
                  <Label htmlFor="author" className="text-base font-medium">Author *</Label>
                  <Select 
                    value={formData.author}
                    onValueChange={(value) => handleInputChange("author", value)}
                  >
                    <SelectTrigger id="author" className="mt-2 h-12">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H. Smith">H. Smith</SelectItem>
                      <SelectItem value="Captain Johnson">Captain Johnson</SelectItem>
                      <SelectItem value="Maritime Expert">Maritime Expert</SelectItem>
                      <SelectItem value="Industry Analyst">Industry Analyst</SelectItem>
                      <SelectItem value="Guest Writer">Guest Writer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status" className="text-base font-medium">Status *</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value as ArticleFormData["status"])}
                  >
                    <SelectTrigger id="status" className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">
                SEO & Settings
              </h3>

              <div className="space-y-8 max-w-2xl">
                {/* SEO Title */}
                <div>
                  <Label htmlFor="seoTitle" className="text-base font-medium block mb-3">
                    SEO Title
                  </Label>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <Input
                      id="seoTitle"
                      placeholder="Maximum 60 characters..."
                      className="border-0 p-0 text-base h-auto focus-visible:ring-0"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                      maxLength={60}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        Recommended: 50-60 characters
                      </p>
                      <p className={`text-xs ${formData.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.seoTitle.length}/60
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <Label htmlFor="metaDescription" className="text-base font-medium block mb-3">
                    Meta Description
                  </Label>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <Textarea
                      id="metaDescription"
                      placeholder="Maximum 160 characters..."
                      rows={3}
                      className="border-0 p-0 text-base resize-none focus-visible:ring-0"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      maxLength={160}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        Recommended: 150-160 characters
                      </p>
                      <p className={`text-xs ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.metaDescription.length}/160
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags" className="text-base font-medium block mb-3">
                    Tags
                  </Label>
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas (maximum 3 tags)..."
                      className="border-0 p-0 text-base h-auto focus-visible:ring-0"
                      value={formData.tags.join(", ")}
                      onChange={(e) => handleTagsChange(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-xs text-gray-500">
                        Maximum 3 tags
                      </p>
                      <p className={`text-xs ${formData.tags.length > 3 ? 'text-red-500' : 'text-gray-500'}`}>
                        {formData.tags.length}/3
                      </p>
                    </div>
                    
                    {/* نمایش تگ‌های انتخاب شده */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <Label htmlFor="visibility" className="text-base font-medium">Visibility</Label>
                  <Select 
                    value={formData.visibility}
                    onValueChange={(value) => handleInputChange("visibility", value as ArticleFormData["visibility"])}
                  >
                    <SelectTrigger id="visibility" className="mt-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Premium">Premium (Members Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Article Content */}
                <div>
                  <Label htmlFor="content" className="text-base font-medium">Article Content</Label>
                  <div className="mt-2">
                    <Textarea
                      id="content"
                      placeholder="Write the full article content here..."
                      rows={8}
                      className="w-full resize-none"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-10">
                Media Upload
              </h3>

              <div className="max-w-2xl mx-auto">
                {/* باکس بزرگ Drag & Drop */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-all duration-200">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center py-20 px-8 cursor-pointer group"
                  >
                    {/* آیکن آپلود */}
                    <div className="mb-6">
                      {isLoading ? (
                        <Loader2 className="w-16 h-16 text-[#1A365D] animate-spin" />
                      ) : formData.thumbnail ? (
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img 
                              src={formData.thumbnail} 
                              alt="Uploaded thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      ) : currentArticle?.thumbnail ? (
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img 
                              src={currentArticle.thumbnail} 
                              alt="Current thumbnail" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <svg
                          className="w-16 h-16 text-gray-400 group-hover:text-[#1A365D] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* متن‌ها */}
                    {isLoading ? (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">Uploading...</p>
                        <p className="text-sm text-gray-500">Please wait while we upload your image</p>
                      </>
                    ) : formData.thumbnail ? (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">New image uploaded successfully!</p>
                        <p className="text-sm text-gray-500">Click to change or upload another image</p>
                      </>
                    ) : currentArticle?.thumbnail ? (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">Current cover image</p>
                        <p className="text-sm text-gray-500">Click to change or upload new image</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag and drop files here or upload
                        </p>
                        <p className="text-sm text-gray-500 text-center max-w-md">
                          Upload article cover image (Recommended: 1200 × 630 pixels)
                        </p>
                      </>
                    )}

                    {/* دکمه مخفی برای کلیک */}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>

                {/* نمایش وضعیت آپلود */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    {formData.thumbnail 
                      ? "New image uploaded successfully" 
                      : currentArticle?.thumbnail 
                      ? "Using current article cover image" 
                      : "No cover image uploaded"}
                  </p>
                </div>

                {/* نکته کوچک پایین باکس */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    Maximum file size: 5MB • Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                {/* نمایش خلاصه مقاله */}
                <div className="mt-10 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Article Summary</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Title:</p>
                      <p className="font-medium">{formData.title || "Not set"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Category:</p>
                        <p className="font-medium">{formData.category || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Author:</p>
                        <p className="font-medium">{formData.author || "Not set"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Status:</p>
                        <p className="font-medium">{formData.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Visibility:</p>
                        <p className="font-medium">{formData.visibility}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">SEO Title:</p>
                      <p className="font-medium">{formData.seoTitle || "Not set"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* دکمه‌ها */}
        <div className="mt-12 flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="px-8"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === 3 ? (
              <>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 px-10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Update Article
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={handleSaveDraft}
                disabled={currentStep === 3 || isLoading}
                className="bg-[#1A365D] hover:bg-[#152a4a] px-10"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Next & Save draft
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
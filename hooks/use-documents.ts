"use client";

import useSWR, { mutate } from "swr";
import { swrFetcher, api } from "@/lib/api";

// Frontend Document model
export interface Document {
  id: string;                    // string in UI (e.g., "DOC-4532" or "1")
  title: string;
  activity: string;              // Display name: "Ship Finance", "Trading", etc.
  type: string;                  // PDF, DOCX, XLSX, IMG, VID, LINK
  file: string | null;           // Direct file URL if uploaded
  url: string | null;            // External link if provided
  author: string;                // uploaded_by → formatted
  status: "Active" | "Archive";
  date: string;                  // Formatted updated_at or created_at
}

interface DocumentApiResponse {
  id: number;
  title: string;
  activity: string;              // slug like "ship_finance"
  activity_display?: string;     // may be returned in future
  type: string;
  file: string | null;
  url: string | null;
  uploaded_by: string;
  status: "Active" | "Archive";
  created_at: string;
  updated_at: string;
}

interface DocumentsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DocumentApiResponse[];
}

// Mock fallback data
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Shipping Guide",
    activity: "Ship Finance",
    type: "PDF",
    file: "https://example.com/shipping-guide.pdf",
    url: null,
    author: "H.Smith",
    status: "Active",
    date: "Jan 15, 2025",
  },
  {
    id: "2",
    title: "Tanker Safety Guidelines",
    activity: "Trading",
    type: "DOCX",
    file: null,
    url: "https://example.com/safety.docx",
    author: "J.Doe",
    status: "Active",
    date: "Jan 17, 2025",
  },
];

const mockStats = {
  total: 54,
  active: 48,
  archive: 6,
};

const API_URL = "/api/management/core/documents/";

const activityDisplayMap: Record<string, string> = {
  ship_finance: "Ship Finance",
  trading: "Maritime Trading",
  brokerage: "Ship Brokerage",
  consultancy: "Consultancy",
  project_posting: "Project Posting",
  general: "General",
};

export function useDocuments() {
  const {
    data,
    error,
    isLoading,
  } = useSWR<DocumentsApiResponse>(API_URL, swrFetcher, {
    fallbackData: {
      count: mockStats.total,
      next: null,
      previous: null,
      results: mockDocuments.map((d, i) => ({
        id: Number(d.id),
        title: d.title,
        activity: Object.keys(activityDisplayMap).find(k => activityDisplayMap[k] === d.activity) || "general",
        type: d.type,
        file: d.file,
        url: d.url,
        uploaded_by: `${d.author}@example.com`,
        status: d.status.toLowerCase() as "Active" | "Archive",
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-15T00:00:00Z",
      })),
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Transform API item → frontend Document
  const mapToDocument = (item: DocumentApiResponse): Document => ({
    id: String(item.id),
    title: item.title,
    activity: activityDisplayMap[item.activity] || item.activity.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    type: item.type,
    file: item.file,
    url: item.url,
    author: item.uploaded_by.split("@")[0],
    status: item.status == "Active" ? "Active" : "Archive",
    date: new Date(item.updated_at || item.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });

  const createDocument = async (payload: {
    title: string;
    activity: string;
    type: string;
    file?: File | null;
    url?: string | null;
    status?: "active" | "archive";
  }) => {
    try {
      // اگر فایل داریم → حتماً از FormData استفاده کن
      if (payload.file) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("activity", payload.activity);
        formData.append("type", payload.type);
        formData.append("file", payload.file); // فایل واقعی
        if (payload.status) formData.append("status", payload.status);
  
        const response = await api.post(API_URL, formData);
        // مهم: هیچ headers نذار! axios خودش Content-Type رو با boundary تنظیم می‌کنه
  
        await mutate(API_URL);
        return { success: true, data: response.data };
      }
  
      // اگر فقط لینک خارجی داریم → می‌تونیم از JSON استفاده کنیم
      if (payload.url) {
        const jsonPayload = {
          title: payload.title,
          activity: payload.activity,
          type: payload.type,
          url: payload.url,
          status: payload.status || "Active",
        };
  
        const response = await api.post(API_URL, jsonPayload);
        // اینجا axios خودش Content-Type: application/json می‌ذاره
  
        await mutate(API_URL);
        return { success: true, data: response.data };
      }
  
      throw new Error("Either file or url must be provided");
    } catch (err: any) {
      console.error("Create document failed:", err);
      return {
        success: false,
        message: err.response?.data?.detail || err.response?.data?.file?.[0] || "Failed to create document",
        error: err,
      };
    }
  };
  const updateDocument = async (
    id: string | number,
    payload: Partial<{
      title: string;
      activity: string;
      type: string;
      file?: File | null;
      url?: string | null;
      status: "active" | "archive";
    }>
  ) => {
    try {
      const formData = new FormData();
      if (payload.title) formData.append("title", payload.title);
      if (payload.activity) formData.append("activity", payload.activity);
      if (payload.type) formData.append("type", payload.type);
      if (payload.file !== undefined) {
        if (payload.file) formData.append("file", payload.file);
        // To clear file: send empty string or null (depends on backend)
        else formData.append("file", "");
      }
      if (payload.url !== undefined) formData.append("url", payload.url || "");
      if (payload.status) formData.append("status", payload.status);
  
      await api.patch(`${API_URL}${id}/`, formData);
      // No headers!
  
      await mutate(API_URL);
      return { success: true };
    } catch (err: any) {
      console.error("Update failed:", err);
      return { success: false, message: "Failed to update document" };
    }
  };
  const deleteDocument = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`${API_URL}${id}/`);
      await mutate(API_URL);
      alert("Document deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete document");
    }
  };

  const rawResults = data?.results ?? [];
  const documents: Document[] = rawResults.map(mapToDocument);

  const stats = {
    total: data?.count ?? mockStats.total,
    active: documents.filter(d => d.status === "Active").length,
    archive: documents.filter(d => d.status === "Archive").length,
  };

  return {
    documents,
    stats,
    count: data?.count ?? mockStats.total,
    nextPage: data?.next ?? null,
    previousPage: data?.previous ?? null,
    isLoading,
    isError: !!error,
    error,

    // CRUD methods
    createDocument,
    updateDocument,
    deleteDocument,

    mutate: () => mutate(API_URL),
  };
}
"use client"

import { api } from "@/lib/api"

const IMAGE_ENDPOINT = (productId: number) => `/api/management/trading/products/${productId}/images/`
const DOC_ENDPOINT = (productId: number) => `/api/management/trading/products/${productId}/docs/`

export function useTradingFileUploads() {
  const uploadProductImage = async (productId: number, file: File, title: string) => {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("title", title)

    const response = await api.post(IMAGE_ENDPOINT(productId), formData)
    if (response.error) {
      return { success: false, message: response.error.message }
    }
    return { success: true, image: response.data }
  }

  const uploadProductDocument = async (productId: number, file: File, title: string, type: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("type", type)

    const response = await api.post(DOC_ENDPOINT(productId), formData)
    if (response.error) {
      return { success: false, message: response.error.message }
    }
    return { success: true, document: response.data }
  }

  return {
    uploadProductImage,
    uploadProductDocument,
  }
}

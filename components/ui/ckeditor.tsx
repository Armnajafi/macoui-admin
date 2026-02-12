"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    ClassicEditor?: {
      create: (element: HTMLElement, config?: Record<string, unknown>) => Promise<CKEditorInstance>
    }
  }
}

type CKEditorInstance = {
  destroy: () => Promise<void>
  getData: () => string
  setData: (data: string) => void
  model: {
    document: {
      on: (event: "change:data", callback: () => void) => void
    }
  }
}

type CkEditorProps = {
  id: string
  value: string
  onChange: (value: string) => void
}

const CKEDITOR_SCRIPT_ID = "ckeditor-5-script"
const CKEDITOR_SRC = "https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js"

export function CkEditor({ id, value, onChange }: CkEditorProps) {
  const editorHostRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<CKEditorInstance | null>(null)
  const onChangeRef = useRef(onChange)

  onChangeRef.current = onChange

  useEffect(() => {
    let isMounted = true

    const initializeEditor = async () => {
      if (!editorHostRef.current) return

      if (!window.ClassicEditor) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById(CKEDITOR_SCRIPT_ID) as HTMLScriptElement | null
          if (existingScript) {
            if (existingScript.dataset.loaded === "true") {
              resolve()
              return
            }
            existingScript.addEventListener("load", () => resolve(), { once: true })
            existingScript.addEventListener("error", () => reject(new Error("Failed to load CKEditor script.")), { once: true })
            return
          }

          const script = document.createElement("script")
          script.id = CKEDITOR_SCRIPT_ID
          script.src = CKEDITOR_SRC
          script.async = true
          script.onload = () => {
            script.dataset.loaded = "true"
            resolve()
          }
          script.onerror = () => reject(new Error("Failed to load CKEditor script."))
          document.body.appendChild(script)
        })
      }

      if (!isMounted || !editorHostRef.current || !window.ClassicEditor) return

      const editor = await window.ClassicEditor.create(editorHostRef.current)
      editor.setData(value)
      editor.model.document.on("change:data", () => {
        onChangeRef.current(editor.getData())
      })
      editorRef.current = editor
    }

    initializeEditor().catch((error) => {
      console.error(error)
    })

    return () => {
      isMounted = false
      if (editorRef.current) {
        editorRef.current.destroy().catch(() => undefined)
        editorRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.getData() !== value) {
      editorRef.current.setData(value)
    }
  }, [value])

  return <div id={id} ref={editorHostRef} className="min-h-52 rounded-md border border-input bg-transparent" />
}

// components/brokers/broker-detail-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Broker } from "@/hooks/use-brokers"
import { useState } from "react"

interface BrokerDetailModalProps {
  broker: Broker | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (id: any, status: Broker["status"], note?: string) => Promise<void>
  onDelete: (id: any) => Promise<void>
}

export function BrokerDetailModal({ broker, open, onOpenChange, onUpdateStatus, onDelete }: BrokerDetailModalProps) {
  const [status, setStatus] = useState<Broker["status"]>(broker?.status || "Pending")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  if (!broker) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      await onUpdateStatus(broker.id, status, note || undefined)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Approved": return "bg-green-500"
      case "Rejected": return "bg-red-500"
      case "Pending": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">جزئیات بروکر</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>نام بروکر</Label>
              <p className="text-lg font-medium">{broker.name}</p>
            </div>
            <div>
              <Label>شناسه</Label>
              <p className="text-lg font-mono">{broker.id}</p>
            </div>
            <div>
              <Label>شرکت</Label>
              <p className="text-lg">{broker.company}</p>
            </div>
            <div>
              <Label>مکان</Label>
              <p className="text-lg">{broker.location}</p>
            </div>
            {broker.email && (
              <div>
                <Label>ایمیل</Label>
                <p className="text-lg">{broker.email}</p>
              </div>
            )}
            {broker.phone && (
              <div>
                <Label>تلفن</Label>
                <p className="text-lg dir-ltr text-left">{broker.phone}</p>
              </div>
            )}
          </div>

          <div>
            <Label>وضعیت فعلی</Label>
            <Badge className={`${getStatusColor(broker.status)} text-white`}>
              {broker.status}
            </Badge>
          </div>

          {broker.notes && (
            <div>
              <Label>یادداشت ادمین قبلی</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                {broker.notes}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label>تغییر وضعیت</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Broker["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">در انتظار بررسی</SelectItem>
                <SelectItem value="Approved">تایید شده</SelectItem>
                <SelectItem value="Rejected">رد شده</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Label>یادداشت ادمین (اختیاری)</Label>
              <Textarea
                placeholder="دلیل تغییر وضعیت یا توضیح بدید..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("مطمئنید می‌خواهید این بروکر را حذف کنید؟")) {
                  onDelete(broker.id)
                  onOpenChange(false)
                }
              }}
            >
              حذف بروکر
            </Button>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                لغو
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
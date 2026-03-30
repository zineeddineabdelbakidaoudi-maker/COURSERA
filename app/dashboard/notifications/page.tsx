"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Bell, Check, Trash2, Clock, Info, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

export default function NotificationsPage() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("Notification")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("Notification")
      .update({ is_read: true })
      .eq("id", id)

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from("Notification")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false)

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      toast.success("All notifications marked as read")
    }
  }

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from("Notification")
      .delete()
      .eq("id", id)

    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success("Notification deleted")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default: return <Bell className="h-5 w-5 text-slate-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1 font-medium">Stay updated with your latest activities and platform alerts.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-xl font-bold gap-2">
            <Check className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
            <Bell className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No notifications yet</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto italic">We'll notify you when something important happens on Digithub.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`group flex items-start gap-4 p-6 rounded-[2rem] border transition-all hover:shadow-md ${
                n.is_read ? "bg-white/50 border-slate-100 opacity-80" : "bg-white border-blue-100 shadow-sm ring-1 ring-blue-50/50"
              }`}
              onClick={() => !n.is_read && markAsRead(n.id)}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${n.is_read ? "bg-slate-100" : "bg-blue-50/50"}`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-lg font-bold truncate ${n.is_read ? "text-slate-700" : "text-slate-900"}`}>{n.title}</h3>
                  <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${n.is_read ? "text-slate-500" : "text-slate-600"}`}>{n.body}</p>
                {n.link && (
                  <Link 
                    href={n.link} 
                    className="mt-3 inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View Details →
                  </Link>
                )}
              </div>

              <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                  className="rounded-full h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

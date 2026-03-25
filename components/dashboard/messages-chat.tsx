"use client"

import React, { useState, useEffect, useRef } from "react"
import { MessageSquare, Search, Send, Paperclip, MoreHorizontal, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export function MessagesChat() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchConversations(user.id)
      } else {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async (userId: string) => {
    // We fetch conversations where the user is a participant.
    // In PostgreSQL array, we can use the 'cs' (contains) operator.
    const { data: convs, error } = await supabase
      .from("Conversation")
      .select(`
        *,
        Message!Message_conversation_id_fkey (
          content,
          created_at
        )
      `)
      .contains("participant_ids", [userId])
      .order("last_message_at", { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    // Now for each conversation, we need the other participant's profile
    const enhancedConvs = await Promise.all(convs.map(async (c: any) => {
      const otherId = c.participant_ids.find((id: string) => id !== userId) || userId
      const { data: profile } = await supabase.from("Profile").select("full_name, avatar_url, role").eq("id", otherId).single()
      
      const lastMsg = c.Message?.length > 0 ? c.Message.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null
      
      return {
        ...c,
        otherUser: profile || { full_name: "Unknown User", role: "user" },
        lastMessageText: lastMsg?.content || "No messages yet",
      }
    }))

    setConversations(enhancedConvs)
    if (enhancedConvs.length > 0) {
      loadMessages(enhancedConvs[0].id)
      setActiveConv(enhancedConvs[0])
    }
    setLoading(false)
  }

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from("Message")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
    
    if (data) setMessages(data)

    // Subscribe to new messages for this conversation
    supabase
      .channel(`room_${convId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message', filter: `conversation_id=eq.${convId}` }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
  }

  const handleSelectConv = (conv: any) => {
    if (activeConv?.id === conv.id) return
    setActiveConv(conv)
    loadMessages(conv.id)
  }

  const handleSend = async () => {
    if (!newMsg.trim() || !activeConv || !user) return
    setSending(true)
    const text = newMsg
    setNewMsg("")

    const { error } = await supabase.from("Message").insert({
      conversation_id: activeConv.id,
      sender_id: user.id,
      content: text
    })

    if (!error) {
      await supabase.from("Conversation").update({ last_message_at: new Date().toISOString() }).eq("id", activeConv.id)
    }
    setSending(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-3xl font-display font-semibold">Messages</h1>
      
      <div className="border border-border rounded-2xl overflow-hidden flex h-[600px] bg-card shadow-sm">
        {/* Sidebar */}
        <div className="w-[80px] sm:w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 h-9 text-sm" placeholder="Search messages..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">No conversations yet</div>
            ) : conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className={cn("w-full text-left p-4 flex items-center justify-center sm:justify-start hover:bg-muted/50 transition-colors", activeConv?.id === conv.id && "bg-primary/5 border-l-2 border-primary")}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.otherUser.avatar_url || ""} />
                      <AvatarFallback>{conv.otherUser.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0 hidden sm:block">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-semibold text-sm truncate">{conv.otherUser.full_name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize truncate">{conv.otherUser.role}</p>
                    <p className="text-xs text-foreground/60 truncate mt-0.5">{conv.lastMessageText}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-16 h-16 text-muted-foreground/20 mb-4" />
              <p className="text-lg font-semibold text-muted-foreground">Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activeConv.otherUser.avatar_url || ""} />
                  <AvatarFallback>{activeConv.otherUser.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{activeConv.otherUser.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{activeConv.otherUser.role}</p>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-end text-center p-8">
                    <p className="text-sm text-muted-foreground mb-4">Start of conversation with {activeConv.otherUser.full_name}</p>
                  </div>
                ) : messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.sender_id === user?.id && "flex-row-reverse")}>
                    <div className={cn("max-w-[75%] px-4 py-2.5 rounded-2xl text-sm", msg.sender_id === user?.id ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-border rounded-tl-none")}>
                      <p>{msg.content}</p>
                      <p className={cn("text-[10px] mt-1 text-right", msg.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="shrink-0"><Paperclip className="w-4 h-4" /></Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    className="flex-1"
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    disabled={sending}
                  />
                  <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90" onClick={handleSend} disabled={sending || !newMsg.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

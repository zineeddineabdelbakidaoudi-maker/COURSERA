"use client"

import React, { useState } from "react"
import { MessageSquare, Search, Send, Paperclip, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const conversations = [
  { id: "1", seller: "Yacine M.", avatar: null, service: "Logo Design", lastMessage: "I'll have the first draft ready by tomorrow morning.", time: "2m ago", unread: 2, online: true },
  { id: "2", seller: "Karim B.", avatar: null, service: "Web Development", lastMessage: "Can you send me the brand guidelines?", time: "1h ago", unread: 0, online: false },
  { id: "3", seller: "Nassima B.", avatar: null, service: "Content Writing", lastMessage: "All 10 articles have been delivered ✅", time: "3h ago", unread: 0, online: true },
]

const mockMessages = [
  { id: "1", from: "seller", text: "Hello! I received your order. Let me confirm the details with you.", time: "10:00 AM" },
  { id: "2", from: "buyer", text: "Hi! Yes, I need a modern minimalist logo for my tech startup.", time: "10:05 AM" },
  { id: "3", from: "seller", text: "Perfect, I have some questions about your color preferences and industry. Can you share any references you like?", time: "10:07 AM" },
  { id: "4", from: "buyer", text: "Sure! I like clean lines, blues and grays. Think Apple or Notion style.", time: "10:12 AM" },
  { id: "5", from: "seller", text: "I'll have the first draft ready by tomorrow morning.", time: "10:14 AM" },
]

export default function BuyerMessagesPage() {
  const [active, setActive] = useState(conversations[0])
  const [newMsg, setNewMsg] = useState("")

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-3xl font-display font-semibold">Messages</h1>
      
      <div className="border border-border rounded-2xl overflow-hidden flex h-[600px] bg-card shadow-sm">
        {/* Sidebar */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 h-9 text-sm" placeholder="Search messages..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActive(conv)}
                className={cn("w-full text-left p-4 hover:bg-muted/50 transition-colors", active.id === conv.id && "bg-primary/5 border-l-2 border-primary")}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.avatar || ""} />
                      <AvatarFallback>{conv.seller.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conv.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="font-semibold text-sm">{conv.seller}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.service}</p>
                    <p className="text-xs text-foreground/60 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">{conv.unread}</Badge>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{active.seller.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{active.seller}</p>
              <p className="text-xs text-muted-foreground">{active.service} • {active.online ? "Online" : "Offline"}</p>
            </div>
            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.from === "buyer" && "flex-row-reverse")}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback>{msg.from === "seller" ? active.seller.charAt(0) : "Me"}</AvatarFallback>
                </Avatar>
                <div className={cn("max-w-sm px-4 py-2.5 rounded-2xl text-sm", msg.from === "buyer" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none")}>
                  <p>{msg.text}</p>
                  <p className={cn("text-xs mt-1 text-right", msg.from === "buyer" ? "text-primary-foreground/70" : "text-muted-foreground")}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="shrink-0"><Paperclip className="w-4 h-4" /></Button>
              <Input
                placeholder="Type your message..."
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                className="flex-1"
                onKeyDown={e => e.key === "Enter" && setNewMsg("")}
              />
              <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90" onClick={() => setNewMsg("")}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

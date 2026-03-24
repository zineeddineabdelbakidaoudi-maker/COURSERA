"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Archive,
  Trash2,
  Star,
  Circle,
} from "lucide-react"

const conversations = [
  {
    id: 1,
    user: "Sarah Johnson",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "That sounds great! Let me know when you can start.",
    time: "2 min ago",
    unread: 2,
    online: true,
    order: "Logo Design",
  },
  {
    id: 2,
    user: "Mike Chen",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Can you make the background a bit darker?",
    time: "15 min ago",
    unread: 0,
    online: true,
    order: "Website Development",
  },
  {
    id: 3,
    user: "Emily Davis",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Thanks for the quick delivery! Perfect work.",
    time: "1 hour ago",
    unread: 0,
    online: false,
    order: "Marketing Kit",
  },
  {
    id: 4,
    user: "Alex Thompson",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "I'll review and get back to you tomorrow.",
    time: "3 hours ago",
    unread: 1,
    online: false,
    order: "UI/UX Design",
  },
  {
    id: 5,
    user: "Jessica Miller",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Do you offer rush delivery options?",
    time: "Yesterday",
    unread: 0,
    online: false,
    order: "SEO Optimization",
  },
]

const messages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    content: "Hi! I saw your logo design service and I'm interested in getting a new logo for my startup.",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Hello Sarah! Thank you for reaching out. I'd love to help you create a logo for your startup. Could you tell me more about your business and what style you're looking for?",
    time: "10:32 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    content: "Sure! We're a tech company focused on AI solutions. I'm looking for something modern and minimalist, preferably with blue tones.",
    time: "10:35 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "Perfect! A modern, minimalist design with blue tones sounds great for an AI tech company. I have a few ideas already. I'll need about 3-4 days to create initial concepts. Would that work for you?",
    time: "10:38 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Johnson",
    content: "That sounds great! Let me know when you can start.",
    time: "10:40 AM",
    isMe: false,
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.user.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-r flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Badge variant="secondary">
                  {conversations.reduce((acc, c) => acc + c.unread, 0)} new
                </Badge>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      selectedConversation.id === conv.id
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Image
                          src={conv.avatar}
                          alt={conv.user}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {conv.online && (
                          <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conv.user}</p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {conv.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {conv.order}
                          </Badge>
                          {conv.unread > 0 && (
                            <Badge className="h-5 w-5 p-0 flex items-center justify-center">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={selectedConversation.avatar}
                    alt={selectedConversation.user}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  {selectedConversation.online && (
                    <Circle className="absolute bottom-0 right-0 h-2.5 w-2.5 fill-green-500 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedConversation.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.online ? "Online" : "Offline"} • {selectedConversation.order}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && messageInput.trim()) {
                      setMessageInput("")
                    }
                  }}
                />
                <Button disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Average response time: 1 hour
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageCircle, X, Send, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function MessengerBall() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchConversations(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
      if (session) {
        fetchConversations(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchConversations = async (userId: string) => {
    const { data, error } = await supabase
      .from('Conversation')
      .select('*, messages:Message(*)')
      .contains('participant_ids', [userId])
    
    if (data) {
      setConversations(data)
    }
  }

  const openChat = async (conv: any) => {
    setActiveChat(conv)
    fetchMessages(conv.id)
  }

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from('Message')
      .select('*, sender:Profile(full_name)')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session || !activeChat) return

    const { error } = await supabase.from('Message').insert({
      conversation_id: activeChat.id,
      sender_id: session.user.id,
      content: newMessage.trim()
    })

    if (!error) {
      setNewMessage("")
      fetchMessages(activeChat.id)
    }
  }

  if (!session) return null // Hide if not logged in

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-[500px]"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <h3 className="font-bold">{activeChat ? "Chat" : "Messages"}</h3>
              <div className="flex items-center gap-2">
                {activeChat && (
                  <button onClick={() => setActiveChat(null)} className="text-sm hover:text-gray-300">Back</button>
                )}
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 hover:text-gray-300" /></button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
              {!activeChat ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {conversations.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10 text-sm">No conversations yet.</div>
                  ) : (
                    conversations.map(conv => (
                      <button key={conv.id} onClick={() => openChat(conv)} className="w-full bg-white p-3 rounded-xl border border-gray-100 text-left hover:border-black transition-colors flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold text-sm truncate">Chat #{conv.id.substring(0, 4)}</p>
                          <p className="text-xs text-gray-400 truncate">
                            {conv.messages && conv.messages.length > 0 
                              ? conv.messages[conv.messages.length - 1].content 
                              : "No messages yet"}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(msg => {
                      const isMe = msg.sender_id === session.user.id
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-black text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <form onSubmit={sendMessage} className="p-3 bg-white border-t flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="w-9 h-9 rounded-full bg-black text-white items-center justify-center flex disabled:opacity-50">
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}

"use client"

import React, { useState } from "react"
import { MessageSquare, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there! 👋 I'm the Digit Hup assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState("")

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setInput("")

    // Simulated Bot Response
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite understand that. Could you rephrase?"
      const lowercaseInput = userMessage.toLowerCase()

      if (lowercaseInput.includes("seller") || lowercaseInput.includes("how to sell")) {
        botResponse = "To become a seller, log into your account and click 'Become a Seller' in the top right. You'll go through a quick 5-step onboarding wizard!"
      } else if (lowercaseInput.includes("payment") || lowercaseInput.includes("withdraw")) {
        botResponse = "We support CIB, Edahabia, and Stripe! Withdrawals are processed automatically every 2 weeks after the 14-day escrow protection period."
      } else if (lowercaseInput.includes("fee") || lowercaseInput.includes("price")) {
        botResponse = "Buyers pay 0% fees! Sellers pay a standard 15% platform fee only on successful orders."
      } else if (lowercaseInput.includes("contact") || lowercaseInput.includes("support")) {
        botResponse = "You can reach our human support team directly via the Contact page or by emailing support@digithup.dz."
      }

      setMessages((prev) => [...prev, { role: "bot", text: botResponse }])
    }, 1000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-premium transition-all duration-300 hover:scale-110 z-50",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div
        className={cn(
          "fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-card border border-border rounded-2xl shadow-premium flex flex-col transition-all duration-300 origin-bottom-right z-50 overflow-hidden",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Digit Hup Support</h3>
              <p className="text-xs text-primary-foreground/80">Online 24/7</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-accent/10" : "bg-primary/10"
              )}>
                {msg.role === "user" ? <User className="w-4 h-4 text-accent" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={cn(
                "px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed",
                msg.role === "user" 
                  ? "bg-accent text-accent-foreground rounded-tr-sm" 
                  : "bg-background border border-border shadow-sm rounded-tl-sm"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full h-12 pl-4 pr-12 rounded-xl border border-border bg-secondary/50 focus:bg-background focus:ring-2 focus:ring-primary/50 outline-none text-sm transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

"use client"

import React, { useState } from "react"
import { AlertTriangle, Send, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function GlobalReportBug() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState("bug")
  const [desc, setDesc] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here it would save to a Reports table in Supabase
    setSent(true)
    setTimeout(() => {
      setIsOpen(false)
      setSent(false)
      setDesc("")
    }, 2000)
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 gap-2 font-medium"
        variant="destructive"
      >
        <AlertTriangle className="w-4 h-4" />
        Report Issue
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Report to Admin
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Let us know if you encountered a problem, a scam, or a technical issue.</p>
              
              {sent ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                  <p className="font-bold text-lg">Report Submitted</p>
                  <p className="text-sm text-muted-foreground mt-1">Our admin team will review this immediately.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issue Type</label>
                    <select 
                      value={type} 
                      onChange={e => setType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="bug">Technical Bug / IT Error</option>
                      <option value="scam">Scam / Fraudulent User</option>
                      <option value="content">Inappropriate Content</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea 
                      required 
                      rows={4} 
                      value={desc} 
                      onChange={e => setDesc(e.target.value)}
                      placeholder="Please provide details about the issue..." 
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Submit Report
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

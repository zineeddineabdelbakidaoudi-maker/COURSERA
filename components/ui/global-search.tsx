"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Box, Briefcase, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import { createClient } from "@/lib/supabase/client"

export function GlobalSearch({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const supabase = createClient()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const fetchSearchResults = async () => {
      setLoading(true)
      const q = `%${query}%`

      const [servicesRes, productsRes] = await Promise.all([
        supabase.from("Service").select("id, title, slug").ilike("title", q).eq("status", "live").limit(5),
        supabase.from("DigitalProduct").select("id, title, slug, type").ilike("title", q).eq("status", "live").limit(5),
      ])

      const combined = [
        ...(servicesRes.data || []).map(s => ({ id: "s_"+s.id, title: s.title, type: "service", url: `/services/${s.slug}` })),
        ...(productsRes.data || []).map(p => ({ id: "p_"+p.id, title: p.title, type: p.type || "product", url: `/store/${p.slug}` }))
      ]

      setResults(combined)
      setLoading(false)
    }

    const debounce = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4 backdrop-blur-sm bg-background/50 animate-in fade-in duration-200">
      {/* Overlay click catcher */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for services, products, or categories..."
            className="flex-1 bg-transparent border-none outline-none px-4 text-lg font-medium placeholder:text-muted-foreground/50"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary/80 text-muted-foreground transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>Type to start searching...</p>
            </div>
          ) : loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
              <p>Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                Suggestions
              </h3>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    router.push(result.url)
                    onClose()
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-secondary focus:bg-secondary outline-none transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      result.type === "service" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    )}>
                      {result.type === "service" ? <Briefcase className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {result.type}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-secondary/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <p>Search powered by Digit Hup Engine</p>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-background border border-border shadow-sm font-sans font-medium text-[10px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}

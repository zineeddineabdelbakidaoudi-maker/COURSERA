"use client"

import React, { useState } from "react"
import { BookOpen, Plus, Pencil, Trash2, Users, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const categories = [
  { id: "1", name: "Graphic Design", sellers: 48, emoji: "🎨", active: true },
  { id: "2", name: "Web Development", sellers: 32, emoji: "💻", active: true },
  { id: "3", name: "Writing & Translation", sellers: 27, emoji: "✍️", active: true },
  { id: "4", name: "Video & Animation", sellers: 19, emoji: "🎬", active: false },
]

export default function PublisherCategoriesPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">My Categories</h1>
          <p className="text-muted-foreground">Manage the categories you curate on the platform.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4" />Request New Category
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <Card key={cat.id} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <Users className="w-4 h-4" />{cat.sellers} sellers
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={cat.active ? "text-green-600 bg-green-500/10 border-green-200" : "text-muted-foreground"}>
                  {cat.active ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

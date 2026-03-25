"use client"

import React from "react"
import { Settings, Save, Server, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global site settings, fees, and operational toggles.</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />General Configuration</CardTitle>
          <CardDescription>Main platform identity and behavior.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input defaultValue="Digit Hup" />
          </div>
          <div className="space-y-2">
            <Label>Support Email Address</Label>
            <Input defaultValue="support@digithup.dz" />
          </div>
          <div className="space-y-2">
            <Label>Platform Fee (%)</Label>
            <Input type="number" defaultValue="15" />
            <p className="text-xs text-muted-foreground">Percentage taken from every successful seller order.</p>
          </div>
          <Button className="gap-2"><Save className="w-4 h-4" />Save Configuration</Button>
        </CardContent>
      </Card>
      
      <Card className="border-destructive/20 shadow-sm bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2"><Server className="w-5 h-5" />Maintenance Mode</CardTitle>
          <CardDescription>Temporarily disable access to the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Enable Maintenance Mode</Button>
        </CardContent>
      </Card>
    </div>
  )
}

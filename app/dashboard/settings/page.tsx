"use client"

import React, { useState, useEffect } from "react"
import { Save, Camera, User, Lock, Bell, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    city: "",
    phone_whatsapp: "",
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from("Profile").select("*").eq("id", user.id).single()
        if (profile) {
          setProfile(profile)
          setForm({
            full_name: profile.full_name || "",
            username: profile.username || "",
            bio: profile.bio || "",
            city: profile.city || "",
            phone_whatsapp: profile.phone_whatsapp || "",
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from("Profile").update({
      full_name: form.full_name,
      username: form.username,
      bio: form.bio,
      city: form.city,
      phone_whatsapp: form.phone_whatsapp,
    }).eq("id", user.id)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your account and profile information.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" />Profile</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Lock className="w-4 h-4" />Security</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Avatar */}
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle>Profile Picture</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
                  <Badge variant="outline" className="text-xs capitalize">{profile?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="e.g. Yacine Medjber" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input id="username" className="pl-7" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="yourhandle" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell buyers about yourself, your skills, and experience..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Algiers" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp Number</Label>
                  <Input id="phone" value={form.phone_whatsapp} onChange={e => setForm({...form, phone_whatsapp: e.target.value})} placeholder="+213 5XX XX XX XX" />
                </div>
              </div>
              <div className="pt-2">
                <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-32">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="gap-2"><Lock className="w-4 h-4" />Update Password</Button>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2"><Shield className="w-5 h-5" />Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose which emails you receive from Digit Hup.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "New Orders", desc: "Get notified when someone places an order." },
                  { label: "New Messages", desc: "Get notified when you receive a message." },
                  { label: "Order Updates", desc: "Updates on order status changes." },
                  { label: "New Reviews", desc: "When a buyer leaves you a review." },
                  { label: "Platform News", desc: "Updates about Digit Hup features and announcements." },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                      <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

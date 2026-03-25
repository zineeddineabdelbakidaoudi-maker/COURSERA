"use client"

import React, { useState, useEffect } from "react"
import { Users, Search, Filter, UserCog, Shield, Briefcase, Eye, BookOpen, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

const roleConfig: Record<string, { class: string; icon: any }> = {
  admin: { class: "bg-red-500/10 text-red-600 border-red-200", icon: Shield },
  seller: { class: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Briefcase },
  buyer: { class: "bg-green-500/10 text-green-600 border-green-200", icon: Users },
  publisher: { class: "bg-purple-500/10 text-purple-600 border-purple-200", icon: BookOpen },
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setUsers(data)
    setLoading(false)
  }

  const changeUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("Profile")
      .update({ role: newRole })
      .eq("id", userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
  }

  const togglePublisherStatus = async (userId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from("Profile")
      .update({ is_publisher: !currentValue })
      .eq("id", userId)
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, is_publisher: !currentValue } : u))
    } else {
      console.error("Toggle publisher error:", error)
    }
  }

  const filtered = users.filter(u =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">User Management</h1>
          <p className="text-muted-foreground">View, manage, and assign roles to platform users.</p>
        </div>
        <Badge variant="outline" className="text-sm">{users.length} Total Users</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["buyer", "seller", "admin"].map(role => {
          const count = users.filter(u => u.role === role).length
          const cfg = roleConfig[role]
          const Icon = cfg?.icon
          return (
            <Card key={role} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${cfg?.class}`}>{Icon && <Icon className="w-4 h-4" />}</div>
                <div>
                  <p className="text-xs text-muted-foreground capitalize">{role}s</p>
                  <p className="text-xl font-bold">{count}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-semibold p-4 text-muted-foreground">User</th>
                  <th className="text-left font-semibold p-4 text-muted-foreground">Role</th>
                  <th className="text-left font-semibold p-4 text-muted-foreground hidden sm:table-cell">Joined</th>
                  <th className="text-left font-semibold p-4 text-muted-foreground hidden md:table-cell">Status</th>
                  <th className="text-right font-semibold p-4 text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found.</td></tr>
                ) : filtered.map(user => {
                  const roleName = user.role || "buyer"
                  const role = roleConfig[roleName] || roleConfig.buyer
                  const RoleIcon = role.icon
                  const dateJoined = new Date(user.created_at).toLocaleDateString()
                  // Compute status based on seller/publisher flags or just default active
                  let status = "active"
                  if (user.seller_status === 'suspended') status = 'suspended'
                  
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback>{(user.full_name || user.email || "U").charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <Badge variant="outline" className={`gap-1.5 ${role.class}`}>
                            <RoleIcon className="w-3 h-3" />
                            {roleName}
                          </Badge>
                          {user.is_publisher && (
                            <Badge variant="outline" className="gap-1.5 bg-purple-500/10 text-purple-600 border-purple-200">
                              <BookOpen className="w-3 h-3" />
                              Publisher
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">{dateJoined}</td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="outline" className={status === "active" ? "text-green-600 border-green-200 bg-green-500/10" : "text-red-500 border-red-200 bg-red-500/10"}>
                          {status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <UserCog className="w-3.5 h-3.5" />
                              Manage
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(user.id, "admin")}>
                              <Shield className="w-4 h-4 mr-2" />Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => togglePublisherStatus(user.id, !!user.is_publisher)}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              {user.is_publisher ? "Revoke Publisher" : "Enable Publisher"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(user.id, "seller")}>
                              <Briefcase className="w-4 h-4 mr-2" />Make Seller
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => changeUserRole(user.id, "buyer")}>
                              <Users className="w-4 h-4 mr-2" />Make Buyer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

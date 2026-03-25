"use client"

import React, { useState } from "react"
import { Users, Search, Filter, UserCog, Shield, Briefcase, Eye, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const roleConfig: Record<string, { class: string; icon: any }> = {
  admin: { class: "bg-red-500/10 text-red-600 border-red-200", icon: Shield },
  seller: { class: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Briefcase },
  buyer: { class: "bg-green-500/10 text-green-600 border-green-200", icon: Users },
  publisher: { class: "bg-purple-500/10 text-purple-600 border-purple-200", icon: BookOpen },
}

const users = [
  { id: "1", name: "Yacine Medjber", email: "yacine@gmail.com", role: "seller", joined: "Jan 12, 2026", orders: 34, status: "active" },
  { id: "2", name: "Karim Belkacem", email: "karim@gmail.com", role: "buyer", joined: "Feb 3, 2026", orders: 8, status: "active" },
  { id: "3", name: "Nassima Bensalem", email: "nassima@gmail.com", role: "publisher", joined: "Nov 20, 2025", orders: 0, status: "active" },
  { id: "4", name: "Amine Khaldi", email: "amine@gmail.com", role: "seller", joined: "Mar 1, 2026", orders: 12, status: "suspended" },
  { id: "5", name: "Sara Mokrane", email: "sara@gmail.com", role: "buyer", joined: "Mar 15, 2026", orders: 2, status: "active" },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

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
        {["buyer", "seller", "publisher", "admin"].map(role => {
          const count = users.filter(u => u.role === role).length
          const cfg = roleConfig[role]
          const Icon = cfg.icon
          return (
            <Card key={role} className="border-border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg border ${cfg.class}`}><Icon className="w-4 h-4" /></div>
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
          <Input className="pl-9" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />Filter
        </Button>
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
                {filtered.map(user => {
                  const role = roleConfig[user.role]
                  const RoleIcon = role.icon
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`gap-1.5 ${role.class}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">{user.joined}</td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant="outline" className={user.status === "active" ? "text-green-600 border-green-200 bg-green-500/10" : "text-red-500 border-red-200 bg-red-500/10"}>
                          {user.status}
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
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="w-4 h-4 mr-2" />Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen className="w-4 h-4 mr-2" />Make Publisher
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Briefcase className="w-4 h-4 mr-2" />Make Seller
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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

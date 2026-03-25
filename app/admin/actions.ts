"use server"

import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createClient as createServerClient } from "@/lib/supabase/server"

// Uses the SERVICE ROLE key — bypasses ALL RLS policies
// Only called from server actions, never exposed to client
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function togglePublisherAction(userId: string, currentStatus: string) {
  // 1. Verify the caller is an admin
  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: callerProfile } = await serverSupabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single()

  if (callerProfile?.role !== "admin") {
    return { error: "Not authorized — admin only" }
  }

  // 2. Perform the update with service role (bypasses RLS)
  const newStatus = currentStatus === "enabled" ? "disabled" : "enabled"
  const adminClient = getAdminClient()
  const { error } = await adminClient
    .from("Profile")
    .update({ publisher_status: newStatus })
    .eq("id", userId)

  if (error) return { error: error.message }
  return { success: true, newStatus }
}

export async function changeUserRoleAction(userId: string, newRole: string) {
  // 1. Verify admin
  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: callerProfile } = await serverSupabase
    .from("Profile")
    .select("role")
    .eq("id", user.id)
    .single()

  if (callerProfile?.role !== "admin") {
    return { error: "Not authorized" }
  }

  const adminClient = getAdminClient()
  const { error } = await adminClient
    .from("Profile")
    .update({ role: newRole })
    .eq("id", userId)

  if (error) return { error: error.message }
  return { success: true }
}

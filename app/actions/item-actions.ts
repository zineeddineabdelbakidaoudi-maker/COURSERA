"use server"

import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"

// Server-side file upload that bypasses storage RLS
export async function uploadFileAction(formData: FormData) {
  const file = formData.get("file") as File
  const bucket = formData.get("bucket") as string
  const folder = formData.get("folder") as string

  if (!file || !bucket) return { error: "Missing file or bucket" }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const admin = getAdminClient()
  const ext = file.name.split('.').pop()
  const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { data, error } = await admin.storage.from(bucket).upload(fileName, buffer, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type
  })

  if (error) return { error: error.message }
  const { data: publicUrl } = admin.storage.from(bucket).getPublicUrl(fileName)
  return { url: publicUrl.publicUrl }
}


// We use service role to bypass strictly RLS issues if categories don't exist yet
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Ensure category exists, creating if not, return ID
async function ensureCategory(name: string, type: "services" | "products" | "both") {
  const admin = getAdminClient()
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  
  const { data: existing } = await admin
    .from("Category")
    .select("id")
    .eq("slug", slug)
    .single()
    
  if (existing) return existing.id
  
  const { data: newCat, error } = await admin
    .from("Category")
    .insert({
      name_en: name,
      name_ar: name, // Simplified for now
      name_fr: name,
      slug,
      type
    })
    .select("id")
    .single()
    
  if (error) throw new Error("Category creation failed: " + error.message)
  return newCat.id
}

export async function createDigitalProductAction(payload: any) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  try {
    const admin = getAdminClient()
    const category_id = await ensureCategory(payload.category, "products")
    
    // Map string values to DB Enums
    const typeMap: Record<string, string> = {
      "Template": "template", "E-book": "ebook", "Course": "course", "Toolkit": "toolkit", "Bundle": "bundle"
    }
    const type = typeMap[payload.type] || "template"

    const licenseMap: Record<string, string> = {
      "Personal Use Only": "personal", "Commercial Use": "commercial", "Extended License": "extended", "Open Source (Free)": "personal"
    }
    const license = licenseMap[payload.license] || "personal"

    const langMap: Record<string, string> = {
      "Arabic (AR)": "ar", "French (FR)": "fr", "English (EN)": "en", "Multi-language": "multi"
    }
    const language = langMap[payload.language] || "en"

    const { data, error } = await admin
      .from("DigitalProduct")
      .insert({
        publisher_id: user.id,
        title: payload.title,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 10000),
        description: payload.description,
        type: type,
        category_id: category_id,
        tags: payload.tags || [],
        status: payload.status === "live" ? "live" : "draft",
        cover_url: payload.cover_url,
        preview_urls: payload.preview_urls || [],
        file_url: payload.file_url,
        file_size_mb: payload.file_size_mb,
        price_dzd: payload.price_dzd,
        is_free: payload.price_dzd === 0,
        license_type: license,
        language: language,
      })
      .select("id")
      .single()

    if (error) return { error: error.message }
    return { success: true, id: data.id }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function createServiceAction(payload: any) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  try {
    const admin = getAdminClient()
    const category_id = await ensureCategory(payload.category, "services")

    const { data, error } = await admin
      .from("Service")
      .insert({
        seller_id: user.id,
        title: payload.title,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 10000),
        description: payload.description,
        category_id: category_id,
        tags: payload.tags || [],
        status: "live",
        thumbnail_url: payload.images?.[0] || null,
        gallery_urls: payload.images?.slice(1) || [],
        packages: payload.packages,
        order_requirements: payload.requirements,
      })
      .select("id")
      .single()

    if (error) return { error: error.message }
    return { success: true, id: data.id }
  } catch (err: any) {
    return { error: err.message }
  }
}


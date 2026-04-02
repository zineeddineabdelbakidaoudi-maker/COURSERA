import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    // Ensure the caller is an admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from('Profile')
      .select('role')
      .eq('id', user.id)
      .single()
      
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch the product from Supabase using admin-level (anon or service_role, anon is fine for basic read if RLS permits)
    const { data: product, error: productError } = await supabase
      .from('DigitalProduct')
      .select('*, category_id(name_en)')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: `Product not found: ${productError?.message || ''}` }, { status: 404 });
    }

    // Call Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
    }
    
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const promptText = `You are a world-class frontend developer and copywriter.
Generate a complete, beautiful, single-file HTML landing page for the following digital product.

Requirements:
- Inline all CSS (no external stylesheets except Google Fonts or Tailwind Play CDN if you prefer)
- Use standard HTML/CSS. If using classes, you can use Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Modern design: dark/light hero, gradient CTA, feature grid
- Sections: Hero, Features, Who It's For, Pricing, FAQ, CTA
- Include the product name, description, price, and category
- Add a prominent "Buy Now" button linking to: https://digithub-app.vercel.app/store/${product.slug || product.id}
- Mobile responsive
- No placeholder text — every word must be about this product
- DO NOT INCLUDE ANY MARKDOWN CODE BLOCKS AROUND THE RESPONSE. DO NOT ADD \`\`\`html. JUST RETURN RAW HTML.

Product data:
Name: ${product.title}
Description: ${product.description}
Price: ${product.price_dzd} DZD
Category: ${product.category_id?.name_en || 'Digital Goods'}
Tags: ${(product.tags || []).join(', ')}`;

    const result = await model.generateContent(promptText);
    const response = await result.response;
    let html = response.text();
    html = html.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/i, '');

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error('Error in /api/generate-landing:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

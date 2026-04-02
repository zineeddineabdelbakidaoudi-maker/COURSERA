"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Download, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LandingGeneratorPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('DigitalProduct')
        .select('id, title, category_id, price_dzd')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) setProducts(data);
    }
    loadProducts();
  }, [supabase]);

  const handleGenerate = async () => {
    if (!selectedProductId) return;
    setIsLoading(true);
    setHtmlContent('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/generate-landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProductId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setHtmlContent(data.html);
      toast.success('Landing page generated successfully!');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      toast.error('Failed to generate landing page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!htmlContent) return;
    const product = products.find(p => p.id === selectedProductId);
    const filename = `${product?.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'landing'}-page.html`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    toast.success('HTML copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Landing Page Generator</h1>
        <p className="text-muted-foreground mt-2">
          Automatically create beautiful, single-file HTML landing pages for your products using Gemini AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6">
        {/* Left Panel: Controls */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Select a product to generate its landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Product</label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} - {p.price_dzd} DZD
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <Button 
              className="w-full gap-2" 
              onClick={handleGenerate}
              disabled={!selectedProductId || isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {isLoading ? 'Generating (takes ~10s)...' : 'Generate Landing Page'}
            </Button>
          </CardContent>
        </Card>

        {/* Right Panel: Preview */}
        <Card className="flex flex-col h-[700px] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 border-b border-border bg-muted/20">
            <CardTitle className="text-base font-medium">Live Preview</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2" onClick={handleCopy} disabled={!htmlContent}>
                <Copy className="w-4 h-4" /> Copy Code
              </Button>
              <Button size="sm" className="gap-2" onClick={handleDownload} disabled={!htmlContent}>
                <Download className="w-4 h-4" /> Download HTML
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 relative bg-white">
            {htmlContent ? (
              <iframe 
                srcDoc={htmlContent} 
                className="w-full h-full border-none" 
                title="Landing Page Preview" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50">
                <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                <p>Generated preview will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

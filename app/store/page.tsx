"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronRight,
  X,
  Star,
  GraduationCap,
  BookOpen,
  FileText,
  Wrench,
  Package,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/marketplace/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { featuredProducts } from "@/lib/data"

// ━━━ FILTER OPTIONS ━━━
const productTypes = [
  { value: "all", label: "All Products", icon: Package },
  { value: "course", label: "Courses", icon: BookOpen },
  { value: "template", label: "Templates", icon: FileText },
  { value: "ebook", label: "Ebooks", icon: BookOpen },
  { value: "toolkit", label: "Toolkits", icon: Wrench },
]

const ratingOptions = [
  { value: "any", label: "Any Rating" },
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4.0", label: "4.0+ Stars" },
]

// ━━━ FILTER SIDEBAR ━━━
function FilterSidebar({
  className,
  priceRange,
  setPriceRange,
  selectedType,
  setSelectedType,
  rating,
  setRating,
  showBestSellers,
  setShowBestSellers,
  showNew,
  setShowNew,
}: {
  className?: string
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedType: string
  setSelectedType: (value: string) => void
  rating: string
  setRating: (value: string) => void
  showBestSellers: boolean
  setShowBestSellers: (value: boolean) => void
  showNew: boolean
  setShowNew: (value: boolean) => void
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Product Type */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Product Type
          <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {productTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={selectedType === type.value}
                onCheckedChange={() => setSelectedType(type.value)}
              />
              <Label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer flex items-center gap-2">
                <type.icon className="w-4 h-4 text-muted-foreground" />
                {type.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Price (DZD)
          <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={10000}
            step={100}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono">{priceRange[0].toLocaleString()} DZD</span>
            <span className="font-mono">{priceRange[1].toLocaleString()} DZD</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Rating
          <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {ratingOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`rating-${option.value}`}
                checked={rating === option.value}
                onCheckedChange={() => setRating(option.value)}
              />
              <Label htmlFor={`rating-${option.value}`} className="text-sm cursor-pointer flex items-center gap-1">
                {option.value !== "any" && <Star className="w-3 h-3 fill-warning text-warning" />}
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Special Filters */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Special
          <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="best-sellers"
              checked={showBestSellers}
              onCheckedChange={(checked) => setShowBestSellers(checked as boolean)}
            />
            <Label htmlFor="best-sellers" className="text-sm cursor-pointer flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warning" />
              Best Sellers
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="new-products"
              checked={showNew}
              onCheckedChange={(checked) => setShowNew(checked as boolean)}
            />
            <Label htmlFor="new-products" className="text-sm cursor-pointer">
              New Arrivals
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function StorePage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("newest")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = React.useState([0, 10000])
  const [selectedType, setSelectedType] = React.useState("all")
  const [rating, setRating] = React.useState("any")
  const [showBestSellers, setShowBestSellers] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)

  // Generate more products for display
  const allProducts = [...featuredProducts, ...featuredProducts.map((p, i) => ({
    ...p,
    id: `${p.id}-${i + 10}`,
    slug: `${p.slug}-${i + 10}`,
  }))]

  const filteredProducts = allProducts.filter((product) => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }
    if (selectedType !== "all" && product.type !== selectedType) {
      return false
    }
    if (rating === "4.5" && product.rating < 4.5) return false
    if (rating === "4.0" && product.rating < 4.0) return false
    if (showBestSellers && !product.isBestSeller) return false
    if (showNew && !product.isNew) return false
    return true
  })

  const activeFiltersCount = [
    selectedType !== "all",
    rating !== "any",
    showBestSellers,
    showNew,
    priceRange[0] !== 0 || priceRange[1] !== 10000,
  ].filter(Boolean).length

  // Featured product (first best seller)
  const featuredProduct = featuredProducts.find((p) => p.isBestSeller)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Skill Growth Store</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-3 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">
              <GraduationCap className="w-4 h-4 mr-1" />
              Skill Growth Store
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">Tools to Grow Your Freelance Career</h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover courses, templates, ebooks, and toolkits created by experienced freelancers to help you succeed.
            </p>
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {productTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                  selectedType === type.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-background border border-border hover:border-accent/50"
                )}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          {/* Featured Product Banner */}
          {featuredProduct && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 p-6 lg:p-8 mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-16 h-16 text-accent" />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <Badge className="mb-2 bg-warning text-warning-foreground border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {"Editor's Choice"}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{featuredProduct.title}</h2>
                  <p className="text-muted-foreground mb-4">{featuredProduct.description}</p>
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{featuredProduct.rating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {featuredProduct.purchaseCount.toLocaleString()} {featuredProduct.type === "course" ? "learners" : "downloads"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <span className="font-mono text-2xl font-bold">
                      {featuredProduct.price.toLocaleString()} DZD
                    </span>
                    <Link href={`/store/${featuredProduct.slug}`}>
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                        Get It Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedType("all")
                        setRating("any")
                        setShowBestSellers(false)
                        setShowNew(false)
                        setPriceRange([0, 10000])
                      }}
                      className="text-xs h-auto py-1"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <FilterSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  rating={rating}
                  setRating={setRating}
                  showBestSellers={showBestSellers}
                  setShowBestSellers={setShowBestSellers}
                  showNew={showNew}
                  setShowNew={setShowNew}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search & Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>

                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                        rating={rating}
                        setRating={setRating}
                        showBestSellers={showBestSellers}
                        setShowBestSellers={setShowBestSellers}
                        showNew={showNew}
                        setShowNew={setShowNew}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-6">
                {filteredProducts.length} products found
              </p>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                )}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("all")
                      setRating("any")
                      setShowBestSellers(false)
                      setShowNew(false)
                      setPriceRange([0, 10000])
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

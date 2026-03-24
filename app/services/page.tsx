"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight,
  X,
  Star,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ServiceCard } from "@/components/marketplace/service-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { featuredServices, categories } from "@/lib/data"

// ━━━ FILTER OPTIONS ━━━
const deliveryOptions = [
  { value: "any", label: "Any" },
  { value: "24h", label: "24 hours" },
  { value: "2days", label: "2 days" },
  { value: "3days", label: "3 days" },
  { value: "7days", label: "7 days" },
]

const sellerLevels = [
  { value: "all", label: "All Levels" },
  { value: "new", label: "New Seller" },
  { value: "rising", label: "Rising Talent" },
  { value: "pro", label: "Pro Seller" },
  { value: "elite", label: "Elite Partner" },
]

const ratingOptions = [
  { value: "any", label: "Any Rating" },
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4.0", label: "4.0+ Stars" },
]

const languageOptions = [
  { value: "arabic", label: "Arabic" },
  { value: "french", label: "French" },
  { value: "english", label: "English" },
  { value: "bilingual", label: "Bilingual" },
]

// ━━━ FILTER SIDEBAR COMPONENT ━━━
function FilterSidebar({ 
  className,
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  deliveryTime,
  setDeliveryTime,
  sellerLevel,
  setSellerLevel,
  rating,
  setRating,
}: {
  className?: string
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedCategories: string[]
  setSelectedCategories: (value: string[]) => void
  deliveryTime: string
  setDeliveryTime: (value: string) => void
  sellerLevel: string
  setSellerLevel: (value: string) => void
  rating: string
  setRating: (value: string) => void
}) {
  const toggleCategory = (slug: string) => {
    setSelectedCategories(
      selectedCategories.includes(slug)
        ? selectedCategories.filter((c) => c !== slug)
        : [...selectedCategories, slug]
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Category
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-2">
              <Checkbox
                id={cat.slug}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label htmlFor={cat.slug} className="text-sm cursor-pointer flex-1">
                {cat.label}
              </Label>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Budget (DZD)
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={500}
            max={50000}
            step={500}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-mono">{priceRange[0].toLocaleString()} DZD</span>
            <span className="font-mono">{priceRange[1].toLocaleString()} DZD</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Delivery Time */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Delivery Time
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {deliveryOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`delivery-${option.value}`}
                checked={deliveryTime === option.value}
                onCheckedChange={() => setDeliveryTime(option.value)}
              />
              <Label htmlFor={`delivery-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Seller Level */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Seller Level
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {sellerLevels.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`level-${option.value}`}
                checked={sellerLevel === option.value}
                onCheckedChange={() => setSellerLevel(option.value)}
              />
              <Label htmlFor={`level-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Rating
          <ChevronDown className="w-4 h-4" />
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

      {/* Language */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold">
          Language
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 space-y-2">
          {languageOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox id={`lang-${option.value}`} />
              <Label htmlFor={`lang-${option.value}`} className="text-sm cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function ServicesPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = React.useState("relevance")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [priceRange, setPriceRange] = React.useState([500, 50000])
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [deliveryTime, setDeliveryTime] = React.useState("any")
  const [sellerLevel, setSellerLevel] = React.useState("all")
  const [rating, setRating] = React.useState("any")
  const [savedServices, setSavedServices] = React.useState<Set<string>>(new Set())

  const toggleSaveService = (id: string) => {
    setSavedServices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Generate more services for the listing
  const allServices = [...featuredServices, ...featuredServices.map((s, i) => ({
    ...s,
    id: `${s.id}-${i + 10}`,
    slug: `${s.slug}-${i + 10}`,
  }))]

  const filteredServices = allServices.filter((service) => {
    if (searchQuery && !service.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (service.price < priceRange[0] || service.price > priceRange[1]) {
      return false
    }
    if (rating === "4.5" && service.rating < 4.5) return false
    if (rating === "4.0" && service.rating < 4.0) return false
    return true
  })

  const activeFiltersCount = [
    selectedCategories.length > 0,
    deliveryTime !== "any",
    sellerLevel !== "all",
    rating !== "any",
    priceRange[0] !== 500 || priceRange[1] !== 50000,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Services</span>
          </nav>

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
                        setSelectedCategories([])
                        setDeliveryTime("any")
                        setSellerLevel("all")
                        setRating("any")
                        setPriceRange([500, 50000])
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
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  deliveryTime={deliveryTime}
                  setDeliveryTime={setDeliveryTime}
                  sellerLevel={sellerLevel}
                  setSellerLevel={setSellerLevel}
                  rating={rating}
                  setRating={setRating}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Explore Services</h1>
                <p className="text-muted-foreground">
                  {filteredServices.length} services found
                </p>
              </div>

              {/* Search & Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                {/* Mobile Filters Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
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
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        deliveryTime={deliveryTime}
                        setDeliveryTime={setDeliveryTime}
                        sellerLevel={sellerLevel}
                        setSellerLevel={setSellerLevel}
                        rating={rating}
                        setRating={setRating}
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
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
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
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm text-muted-foreground">Active filters:</span>
                  {selectedCategories.map((slug) => {
                    const cat = categories.find((c) => c.slug === slug)
                    return (
                      <Badge
                        key={slug}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== slug))}
                      >
                        {cat?.label}
                        <X className="w-3 h-3" />
                      </Badge>
                    )
                  })}
                  {deliveryTime !== "any" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => setDeliveryTime("any")}
                    >
                      {deliveryOptions.find((d) => d.value === deliveryTime)?.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {sellerLevel !== "all" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => setSellerLevel("all")}
                    >
                      {sellerLevels.find((l) => l.value === sellerLevel)?.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  )}
                  {rating !== "any" && (
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => setRating("any")}
                    >
                      {ratingOptions.find((r) => r.value === rating)?.label}
                      <X className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              )}

              {/* Services Grid */}
              {filteredServices.length > 0 ? (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  )}
                >
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      {...service}
                      isSaved={savedServices.has(service.id)}
                      onSaveToggle={() => toggleSaveService(service.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No services found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategories([])
                      setDeliveryTime("any")
                      setSellerLevel("all")
                      setRating("any")
                      setPriceRange([500, 50000])
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredServices.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    1
                  </Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <span className="px-2 text-muted-foreground">...</span>
                  <Button variant="outline" size="sm">12</Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
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

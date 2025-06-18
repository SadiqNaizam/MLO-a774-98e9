import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import RestaurantCard, { RestaurantCardProps } from '@/components/RestaurantCard';
import CuisineFilterChip from '@/components/CuisineFilterChip';

// shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // For promotions section

// Lucide Icons
import { Search, ShoppingCart, User, Utensils, Filter, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


// Mock Data (replace with API call in a real app)
const mockRestaurantsData: RestaurantCardProps[] = [
  {
    id: '1',
    name: 'Pizza Paradise',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['Italian', 'Pizza'],
    rating: 4.5,
    deliveryTimeMinutes: 30,
    promotionalTag: '20% OFF',
  },
  {
    id: '2',
    name: 'Burger Bonanza',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['American', 'Burgers', 'Fast Food'],
    rating: 4.2,
    deliveryTimeMinutes: 25,
  },
  {
    id: '3',
    name: 'Sushi Central',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['Japanese', 'Sushi'],
    rating: 4.8,
    deliveryTimeMinutes: 40,
    promotionalTag: 'Free Edamame',
  },
  {
    id: '4',
    name: 'Taco Town',
    imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['Mexican', 'Tacos'],
    rating: 4.3,
    deliveryTimeMinutes: 20,
  },
  {
    id: '5',
    name: 'Curry Corner',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['Indian', 'Curry'],
    rating: 4.6,
    deliveryTimeMinutes: 35,
  },
  {
    id: '6',
    name: 'Healthy Bites',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    cuisineTypes: ['Salads', 'Healthy', 'Vegan'],
    rating: 4.0,
    deliveryTimeMinutes: 30,
    promotionalTag: 'New User Discount',
  }
];

const cuisineOptions = ['Italian', 'Pizza', 'American', 'Burgers', 'Fast Food', 'Japanese', 'Sushi', 'Mexican', 'Tacos', 'Indian', 'Curry', 'Salads', 'Healthy', 'Vegan'];

const ITEMS_PER_PAGE = 8; // Adjust as needed

const HomePage = () => {
  console.log('HomePage loaded');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'name'>('name');


  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredAndSortedRestaurants = useMemo(() => {
    let restaurants = mockRestaurantsData.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedCuisines.length > 0) {
      restaurants = restaurants.filter(restaurant =>
        selectedCuisines.every(sc => restaurant.cuisineTypes.includes(sc))
      );
    }
    
    return restaurants.sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'deliveryTime') return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
        // Default to name sort
        return a.name.localeCompare(b.name);
    });

  }, [searchTerm, selectedCuisines, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = filteredAndSortedRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };
  
  // For pagination display logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max direct page links
    const halfMax = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        if (currentPage <= halfMax + 1) {
            for (let i = 1; i <= maxPagesToShow -1; i++) pageNumbers.push(i);
            pageNumbers.push('ellipsis-end');
            pageNumbers.push(totalPages);
        } else if (currentPage >= totalPages - halfMax) {
            pageNumbers.push(1);
            pageNumbers.push('ellipsis-start');
            for (let i = totalPages - (maxPagesToShow - 2) ; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            pageNumbers.push('ellipsis-start');
            for (let i = currentPage - halfMax +1 ; i <= currentPage + halfMax -1; i++) pageNumbers.push(i);
            pageNumbers.push('ellipsis-end');
            pageNumbers.push(totalPages);
        }
    }
    return pageNumbers;
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">FoodFleet</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/cart" aria-label="View Cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/user-profile" aria-label="User Profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero/Search Section */}
          <section className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Delicious food, delivered to you.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find your favorite restaurants and cuisines, all in one place.
            </p>
            <div className="max-w-xl mx-auto flex gap-2">
              <Input
                type="search"
                placeholder="Search restaurants or cuisines..."
                className="flex-grow text-base py-6"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset page on search
                }}
              />
              <Button size="lg" className="py-6" aria-label="Search">
                <Search className="h-5 w-5 mr-2" /> Search
              </Button>
            </div>
          </section>

          {/* Cuisine Filters & Sort Section */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold mb-3 sm:mb-0 text-gray-700 dark:text-gray-200 flex items-center">
                    <Filter className="h-6 w-6 mr-2 text-primary"/> Filter by Cuisine
                </h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        Sort by: {sortBy === 'rating' ? 'Rating' : sortBy === 'deliveryTime' ? 'Delivery Time' : 'Name'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('rating')}>Rating</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('deliveryTime')}>Delivery Time</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(cuisine => (
                <CuisineFilterChip
                  key={cuisine}
                  label={cuisine}
                  isSelected={selectedCuisines.includes(cuisine)}
                  onToggle={() => handleCuisineToggle(cuisine)}
                />
              ))}
            </div>
          </section>
          
          {/* Featured Promotions (Placeholder) */}
          <section className="mb-10">
            <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle className="text-primary text-2xl">Today's Hot Deals!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Check out exclusive offers from your favorite restaurants. <Link to="/promotions" className="font-semibold text-primary hover:underline">View All Promotions</Link></p>
                    {/* Placeholder content for promotions, e.g. a carousel or a few highlighted deals */}
                </CardContent>
            </Card>
          </section>


          {/* Restaurant List Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
                {searchTerm || selectedCuisines.length > 0 ? 'Matching Restaurants' : 'Popular Choices'}
            </h2>
            {paginatedRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Utensils className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                    No restaurants found matching your criteria.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filters.
                </p>
              </div>
            )}
          </section>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <section className="flex justify-center py-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {typeof page === 'number' ? (
                            <PaginationLink 
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                            >
                                {page}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </section>
          )}
        </main>
      </ScrollArea>

      {/* Footer */}
      <footer className="border-t bg-gray-100 dark:bg-gray-800 p-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} FoodFleet Inc. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/about" className="hover:text-primary">About Us</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
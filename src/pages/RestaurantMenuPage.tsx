import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // useSearchParams for potential ID, Link for navigation

// Custom Components
import MenuItemCard from '@/components/MenuItemCard'; // Assuming MenuItemCard is in src/components

// shadcn/ui Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Icons
import { ShoppingCart, Home, Utensils, Salad, Pizza, IceCream, Star, Info } from 'lucide-react';

// Placeholder types for menu items and restaurant
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  isAvailable?: boolean;
  customizationAvailable?: boolean;
  category: string; // e.g., 'Appetizers', 'Main Courses', 'Desserts'
}

interface Restaurant {
  id: string;
  name: string;
  logoUrl: string;
  coverImageUrl: string;
  rating: number;
  cuisineTypes: string[];
  description: string;
  address: string;
  menu: MenuItem[];
}

// Placeholder restaurant data (simulating data fetched based on an ID)
const sampleRestaurantData: Restaurant = {
  id: '1',
  name: 'The Gourmet Place',
  logoUrl: 'https://via.placeholder.com/100?text=Logo',
  coverImageUrl: 'https://via.placeholder.com/1200x300?text=Restaurant+Cover',
  rating: 4.5,
  cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
  description: 'Experience authentic Italian cuisine with our selection of freshly made pasta, wood-fired pizzas, and delectable desserts. We use only the finest ingredients to bring you a memorable dining experience.',
  address: '123 Foodie Lane, Gourmet City',
  menu: [
    { id: 'm1', name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil.', price: 12.99, imageUrl: 'https://via.placeholder.com/400x300?text=Margherita+Pizza', customizationAvailable: true, category: 'Pizzas', isAvailable: true },
    { id: 'm2', name: 'Pasta Carbonara', description: 'Spaghetti with creamy egg sauce, pancetta, pecorino romano, and black pepper.', price: 15.50, imageUrl: 'https://via.placeholder.com/400x300?text=Pasta+Carbonara', category: 'Main Courses', isAvailable: true },
    { id: 'm3', name: 'Caprese Salad', description: 'Fresh mozzarella, ripe tomatoes, basil, balsamic glaze.', price: 9.75, imageUrl: 'https://via.placeholder.com/400x300?text=Caprese+Salad', category: 'Appetizers', isAvailable: true },
    { id: 'm4', name: 'Tiramisu', description: 'Ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese, flavored with cocoa.', price: 6.00, imageUrl: 'https://via.placeholder.com/400x300?text=Tiramisu', category: 'Desserts', isAvailable: false },
    { id: 'm5', name: 'Pepperoni Pizza', description: 'Classic pizza with generous pepperoni and mozzarella.', price: 14.50, imageUrl: 'https://via.placeholder.com/400x300?text=Pepperoni+Pizza', customizationAvailable: true, category: 'Pizzas', isAvailable: true },
    { id: 'm6', name: 'Mushroom Risotto', description: 'Creamy risotto with wild mushrooms and parmesan cheese.', price: 16.00, imageUrl: 'https://via.placeholder.com/400x300?text=Risotto', category: 'Main Courses', isAvailable: true },
  ],
};

const RestaurantMenuPage = () => {
  // In a real app, you might get restaurantId from URL params
  // const [searchParams] = useSearchParams();
  // const restaurantId = searchParams.get('id');
  // Then fetch restaurantData based on restaurantId

  const [restaurantData] = useState<Restaurant>(sampleRestaurantData); // Using sample data
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  console.log('RestaurantMenuPage loaded');

  const handleMenuItemAction = (menuItem: MenuItem) => {
    if (menuItem.customizationAvailable) {
      setSelectedMenuItem(menuItem);
      setIsCustomizationDialogOpen(true);
    } else {
      // Directly add to cart logic (placeholder)
      console.log(`Adding ${menuItem.name} to cart.`);
      // Here you would typically call a function to update cart state
      // For example: addToCart(menuItem);
      alert(`${menuItem.name} added to cart!`);
    }
  };

  const handleConfirmCustomization = () => {
    if (selectedMenuItem) {
      console.log(`Adding customized ${selectedMenuItem.name} to cart.`);
      // Here you would typically call a function to update cart state with customizations
      // For example: addToCart(selectedMenuItem, selectedCustomizations);
      alert(`Customized ${selectedMenuItem.name} added to cart!`);
    }
    setIsCustomizationDialogOpen(false);
    setSelectedMenuItem(null);
  };

  const menuCategories = Array.from(new Set(restaurantData.menu.map(item => item.category)));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center">
            <Utensils className="mr-2 h-7 w-7" /> FoodFleet
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="mr-1 h-4 w-4" /> Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/cart">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <ShoppingCart className="mr-1 h-4 w-4" /> Cart
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {/* Add other navigation links like User Profile if needed */}
              <NavigationMenuItem>
                <Link to="/user-profile">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurantData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Restaurant Info Section */}
        <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img src={restaurantData.coverImageUrl} alt={`${restaurantData.name} cover`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-end space-x-4">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={restaurantData.logoUrl} alt={`${restaurantData.name} logo`} />
                    <AvatarFallback>{restaurantData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                 <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{restaurantData.name}</h1>
                     <div className="flex items-center mt-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="text-white font-semibold">{restaurantData.rating.toFixed(1)}</span>
                        <span className="text-gray-200 mx-2">•</span>
                        <span className="text-gray-200">{restaurantData.cuisineTypes.join(', ')}</span>
                    </div>
                 </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-2 flex items-start">
            <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" /> 
            {restaurantData.description}
          </p>
           <p className="text-sm text-gray-500">{restaurantData.address}</p>
        </section>

        {/* Menu Items Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Menu</h2>
           {menuCategories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">{category}</h3>
              <ScrollArea className="h-auto"> {/* Adjust height as needed or remove if not scrolling per category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {restaurantData.menu.filter(item => item.category === category).map((menuItem) => (
                    <MenuItemCard
                      key={menuItem.id}
                      id={menuItem.id}
                      name={menuItem.name}
                      description={menuItem.description}
                      price={menuItem.price}
                      imageUrl={menuItem.imageUrl}
                      isAvailable={menuItem.isAvailable}
                      customizationAvailable={menuItem.customizationAvailable}
                      onPrimaryAction={() => handleMenuItemAction(menuItem)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-6 mt-8">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} FoodFleet. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/" className="hover:text-primary px-2">Home</Link>
            <Link to="/cart" className="hover:text-primary px-2">Cart</Link>
            <span className="px-2">|</span>
            <Link to="#" className="hover:text-primary px-2">Terms of Service</Link>
            <Link to="#" className="hover:text-primary px-2">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* Customization Dialog */}
      {selectedMenuItem && (
        <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Customize {selectedMenuItem.name}</DialogTitle>
              <DialogDescription>
                Make changes to your item here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* Example Customization Options */}
              <div>
                <Label className="font-semibold">Size Options:</Label>
                <RadioGroup defaultValue="medium" className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="r1" />
                    <Label htmlFor="r1">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="r2" />
                    <Label htmlFor="r2">Medium (+$2.00)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="r3" />
                    <Label htmlFor="r3">Large (+$4.00)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="font-semibold">Extra Toppings:</Label>
                <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="topping-cheese" />
                        <Label htmlFor="topping-cheese">Extra Cheese (+$1.50)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="topping-olives" />
                        <Label htmlFor="topping-olives">Olives (+$0.75)</Label>
                    </div>
                </div>
              </div>
               <div>
                <Label htmlFor="special-instructions" className="font-semibold">Special Instructions:</Label>
                <textarea id="special-instructions" placeholder="e.g., no onions" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" rows={2}></textarea>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleConfirmCustomization}>
                Add to Cart (${selectedMenuItem.price.toFixed(2)}) {/* Price should update dynamically */}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RestaurantMenuPage;
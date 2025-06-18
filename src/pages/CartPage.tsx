import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter as ShadcnTableFooter, // Renamed to avoid conflict with semantic <footer>
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast'; // Assuming use-toast is set up for shadcn/ui Toaster
import { Minus, Plus, Trash2, Home, User, Utensils, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantName?: string; // Optional: for context
}

const initialCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    price: 12.99,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    restaurantName: 'Luigi\'s Pizzeria'
  },
  {
    id: 'item2',
    name: 'Classic Beef Burger',
    price: 8.50,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60',
    restaurantName: 'Burger Haven'
  },
  {
    id: 'item3',
    name: 'Soda Can (Coke)',
    price: 1.99,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1581006852262-5904109d7cb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNvZGElMjBjYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    restaurantName: 'Burger Haven'
  },
];

const CartPage: React.FC = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const deliveryFee = 5.00; // Example delivery fee

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId); // Or set to 1, depending on desired behavior
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.10);
      toast({
        title: "Promo Code Applied!",
        description: "10% discount has been applied to your order.",
        variant: "default", // 'default' in shadcn often is green or positive
      });
    } else if (promoCode.toUpperCase() === 'FOODAPP20') {
        setDiscount(subtotal * 0.20);
        toast({
            title: "Promo Code Applied!",
            description: "20% discount has been applied to your order.",
        });
    }
    else if (promoCode) {
      setDiscount(0);
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount + (cartItems.length > 0 ? deliveryFee : 0);

  useEffect(() => {
    // Recalculate discount if subtotal changes and a promo was applied
    if (discount > 0 && promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.10);
    } else if (discount > 0 && promoCode.toUpperCase() === 'FOODAPP20') {
      setDiscount(subtotal * 0.20);
    }
  }, [subtotal, promoCode]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center">
              <Utensils className="h-7 w-7 mr-2" /> FoodApp
            </Link>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center text-gray-600 hover:text-primary">
                  <Home className="h-5 w-5 mr-1" /> Home
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/user-profile" className="flex items-center text-gray-600 hover:text-primary">
                  <User className="h-5 w-5 mr-1" /> Profile
                </Link>
              </Button>
              <Button variant="default" onClick={() => navigate('/cart')} className="relative">
                <ShoppingCart className="h-5 w-5 mr-1" /> Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Your Shopping Cart</CardTitle>
            {cartItems.length > 0 ? (
                 <CardDescription>Review your items and proceed to checkout. Happy eating!</CardDescription>
            ) : (
                <CardDescription>Your cart is currently empty. <Link to="/" className="text-primary hover:underline">Start adding some delicious food!</Link></CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-24 w-24 text-gray-300" />
                <p className="mt-4 text-xl text-gray-500">Your cart is empty.</p>
                <Button asChild className="mt-6">
                  <Link to="/">Browse Restaurants</Link>
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center w-[150px]">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="hidden md:table-cell">
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                          {item.restaurantName && <p className="text-xs text-muted-foreground">{item.restaurantName}</p>}
                        </TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 1)}
                                className="w-12 h-8 text-center hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <ShadcnTableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="hidden md:table-cell"></TableCell>
                      <TableCell colSpan={1} className="md:hidden"></TableCell>
                      <TableCell className="text-right font-medium">Subtotal</TableCell>
                      <TableCell className="text-right font-medium">${subtotal.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {discount > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="hidden md:table-cell"></TableCell>
                        <TableCell colSpan={1} className="md:hidden"></TableCell>
                        <TableCell className="text-right text-green-600">Discount ({promoCode})</TableCell>
                        <TableCell className="text-right text-green-600">-${discount.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                        <TableCell colSpan={3} className="hidden md:table-cell"></TableCell>
                        <TableCell colSpan={1} className="md:hidden"></TableCell>
                        <TableCell className="text-right">Delivery Fee</TableCell>
                        <TableCell className="text-right">${cartItems.length > 0 ? deliveryFee.toFixed(2) : (0).toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow className="font-bold text-lg">
                        <TableCell colSpan={3} className="hidden md:table-cell"></TableCell>
                        <TableCell colSpan={1} className="md:hidden"></TableCell>
                        <TableCell className="text-right">Total</TableCell>
                        <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                  </ShadcnTableFooter>
                </Table>

                <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div className="w-full md:w-auto">
                    <Label htmlFor="promo" className="text-base font-medium">Promo Code</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="promo"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full md:w-64"
                      />
                      <Button onClick={handleApplyPromoCode} disabled={!promoCode}>Apply</Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          {cartItems.length > 0 && (
            <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/checkout">Proceed to Checkout (${total.toFixed(2)})</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} FoodApp. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/about" className="hover:underline text-sm">About Us</Link>
            <Link to="/contact" className="hover:underline text-sm">Contact</Link>
            <Link to="/privacy" className="hover:underline text-sm">Privacy Policy</Link>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Custom Components
import OrderTrackingStepper, { OrderStatus } from '@/components/OrderTrackingStepper';

// Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast"; // Assuming useToast is setup as per shadcn docs

// Lucide Icons
import { User, MapPin, CreditCard, ShoppingBag, Edit2, Trash2, PlusCircle, ExternalLink } from 'lucide-react';

// Profile Form Schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }).optional().or(z.literal('')),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Placeholder Data
interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  zip: string;
  isDefault?: boolean;
}
const sampleAddresses: Address[] = [
  { id: '1', type: 'Home', street: '123 Main St', city: 'Anytown', zip: '12345', isDefault: true },
  { id: '2', type: 'Work', street: '456 Office Ave', city: 'Business City', zip: '67890' },
];

interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex';
  last4: string;
  expiry: string;
  isDefault?: boolean;
}
const samplePaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'Visa', last4: '1234', expiry: '12/25', isDefault: true },
  { id: '2', type: 'Mastercard', last4: '5678', expiry: '06/27' },
];

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
interface Order {
  id: string;
  date: string;
  restaurantName: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}
const sampleOrders: Order[] = [
  { id: 'ORD001', date: '2024-07-20', restaurantName: 'Pizza Place', total: 25.99, status: 'DELIVERED', items: [{id: 'p1', name: 'Pepperoni Pizza', quantity: 1, price: 19.99}] },
  { id: 'ORD002', date: '2024-07-21', restaurantName: 'Burger Joint', total: 15.50, status: 'OUT_FOR_DELIVERY', items: [{id: 'b1', name: 'Cheeseburger', quantity: 1, price: 9.50}] },
  { id: 'ORD003', date: '2024-07-22', restaurantName: 'Sushi Spot', total: 45.00, status: 'PREPARING_FOOD', items: [{id: 's1', name: 'Sushi Platter', quantity: 1, price: 35.00}] },
  { id: 'ORD004', date: '2024-07-23', restaurantName: 'Taco Town', total: 12.75, status: 'ORDER_CONFIRMED', items: [{id: 't1', name: '3 Tacos', quantity: 1, price: 8.75}] },
];

const UserProfilePage = () => {
  console.log('UserProfilePage loaded');
  const [currentAddresses, setCurrentAddresses] = useState<Address[]>(sampleAddresses);
  const [currentPaymentMethods, setCurrentPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "123-456-7890",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile updated:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  }

  const handleTrackOrder = (order: Order) => {
    if (order.status !== 'DELIVERED' && order.status !== 'ORDER_CONFIRMED') { // Allow tracking for relevant statuses
        setSelectedOrderForTracking(order);
    } else if (order.status === 'ORDER_CONFIRMED') {
        setSelectedOrderForTracking(order); // Also allow tracking confirmed orders
    } else {
        setSelectedOrderForTracking(null);
        toast({
            title: "Order Delivered",
            description: "This order has already been delivered.",
            variant: "default"
        });
    }
  };

  // Mock functions for adding/editing (not implemented fully)
  const handleAddAddress = () => toast({ title: "Add Address", description: "Functionality to add address not implemented." });
  const handleEditAddress = (id: string) => toast({ title: "Edit Address", description: `Edit address ${id} not implemented.`});
  const handleDeleteAddress = (id: string) => {
    setCurrentAddresses(prev => prev.filter(addr => addr.id !== id));
    toast({ title: "Address Deleted", description: `Address ${id} deleted.`});
  };
  const handleAddPayment = () => toast({ title: "Add Payment", description: "Functionality to add payment not implemented." });
  const handleEditPayment = (id: string) => toast({ title: "Edit Payment", description: `Edit payment ${id} not implemented.`});
  const handleDeletePayment = (id: string) => {
    setCurrentPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast({ title: "Payment Method Deleted", description: `Payment ${id} deleted.`});
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header - Simple version within the page component */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">FoodDash</Link>
          <nav className="space-x-2 sm:space-x-4">
            <Button variant="ghost" asChild><Link to="/">Home</Link></Button>
            <Button variant="ghost" asChild><Link to="/cart">Cart</Link></Button>
            <Button variant="outline" asChild><Link to="/user-profile">My Account</Link></Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account Dashboard</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="profile" className="flex items-center justify-center gap-2 py-2.5"><User size={18} />Profile</TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center justify-center gap-2 py-2.5"><MapPin size={18} />Addresses</TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center justify-center gap-2 py-2.5"><CreditCard size={18} />Payment</TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center justify-center gap-2 py-2.5"><ShoppingBag size={18} />Order History</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your name, email, and phone number.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 555 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Delivery Addresses</CardTitle>
                    <CardDescription>Manage your saved delivery locations.</CardDescription>
                </div>
                <Button onClick={handleAddAddress} variant="outline"><PlusCircle size={18} className="mr-2"/>Add New Address</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentAddresses.length > 0 ? currentAddresses.map(addr => (
                  <Card key={addr.id} className="p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{addr.type} {addr.isDefault && <span className="text-xs text-green-600">(Default)</span>}</p>
                      <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.zip}</p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditAddress(addr.id)}><Edit2 size={16}/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-600"><Trash2 size={16}/></Button>
                    </div>
                  </Card>
                )) : <p className="text-gray-500">No addresses saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment options.</CardDescription>
                </div>
                <Button onClick={handleAddPayment} variant="outline"><PlusCircle size={18} className="mr-2"/>Add New Payment</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPaymentMethods.length > 0 ? currentPaymentMethods.map(pm => (
                  <Card key={pm.id} className="p-4 flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{pm.type} ending in {pm.last4} {pm.isDefault && <span className="text-xs text-green-600">(Default)</span>}</p>
                      <p className="text-sm text-gray-600">Expires: {pm.expiry}</p>
                    </div>
                     <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditPayment(pm.id)}><Edit2 size={16}/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePayment(pm.id)} className="text-red-500 hover:text-red-600"><Trash2 size={16}/></Button>
                    </div>
                  </Card>
                )) : <p className="text-gray-500">No payment methods saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Review your past orders and track current ones.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.restaurantName}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.status.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Order Details: {order.id}</DialogTitle>
                                    <DialogDescription>
                                        Restaurant: {order.restaurantName} | Total: ${order.total.toFixed(2)}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <h4 className="font-semibold mb-2">Items:</h4>
                                    <ul className="list-disc list-inside text-sm">
                                        {order.items.map(item => (
                                            <li key={item.id}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)}</li>
                                        ))}
                                    </ul>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {(order.status !== 'DELIVERED') && (
                            <Button variant="default" size="sm" onClick={() => handleTrackOrder(order)}>
                              Track Order
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {orders.length === 0 && <TableCaption>You haven't placed any orders yet.</TableCaption>}
                </Table>

                {selectedOrderForTracking && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Tracking Order: {selectedOrderForTracking.id}</CardTitle>
                      <CardDescription>From {selectedOrderForTracking.restaurantName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OrderTrackingStepper currentStatus={selectedOrderForTracking.status} />
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Page Footer - Simple version within the page component */}
      <footer className="bg-gray-100 border-t mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FoodDash Inc. All rights reserved.
          <div className="mt-1">
            <Link to="/terms" className="hover:underline">Terms of Service</Link> | <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserProfilePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock } from 'lucide-react';
import { cn } from "@/lib/utils"; // Assumes cn is available from shadcn/ui setup

export interface RestaurantCardProps {
  id: string; // Unique identifier for the restaurant
  name: string;
  imageUrl: string;
  cuisineTypes: string[]; // e.g., ["Italian", "Pizza"]
  rating: number; // e.g., 4.5 (out of 5)
  deliveryTimeMinutes: number; // e.g., 30
  promotionalTag?: string; // e.g., "20% OFF"
  className?: string; // Allow for additional styling
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTimeMinutes,
  promotionalTag,
  className,
}) => {
  console.log(`RestaurantCard loaded for: ${name} (ID: ${id})`);

  return (
    <Card className={cn("w-full overflow-hidden group shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg", className)}>
      <Link to={`/restaurant-menu?id=${id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {promotionalTag && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 z-10 text-xs px-2 py-1"
            >
              {promotionalTag}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-200 line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1" title={cuisineTypes.join(', ')}>
            {cuisineTypes.join(' • ')}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{deliveryTimeMinutes}-{deliveryTimeMinutes + 10} min</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RestaurantCard;
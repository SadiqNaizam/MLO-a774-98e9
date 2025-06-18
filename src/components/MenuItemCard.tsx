import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Wand2 } from 'lucide-react';

interface MenuItemCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  /** Defaults to true. If false, item is marked unavailable and action button is disabled. */
  isAvailable?: boolean;
  /** If true, primary action button suggests customization (e.g., "View Options"). Otherwise, "Add to Cart". */
  customizationAvailable?: boolean;
  /** Callback function executed when the primary action button is clicked. */
  onPrimaryAction: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  isAvailable = true,
  customizationAvailable = false,
  onPrimaryAction,
}) => {
  console.log(`MenuItemCard loaded for: ${name} (ID: ${id})`);

  const handleActionClick = () => {
    if (isAvailable) {
      onPrimaryAction();
    }
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      {/* Image Section */}
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          <img
            src={imageUrl || 'https://via.placeholder.com/400x300?text=Food+Item'}
            alt={name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">Unavailable</Badge>
          </div>
        )}
      </div>

      {/* Details Section: Name and Description */}
      <CardHeader className="pt-4 px-4 pb-2">
        <CardTitle className="text-xl font-semibold leading-tight line-clamp-2" title={name}>
          {name}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground pt-1 line-clamp-3" title={description}>
            {description}
          </p>
        )}
      </CardHeader>

      {/* Price Section - this part will grow to push footer down */}
      <CardContent className="px-4 pb-3 pt-1 flex-grow">
        <p className="text-2xl font-bold text-primary">
          ${price.toFixed(2)}
        </p>
      </CardContent>

      {/* Action Button Section */}
      <CardFooter className="p-3 border-t bg-slate-50 dark:bg-slate-800/30">
        <Button
          onClick={handleActionClick}
          disabled={!isAvailable}
          className="w-full py-3 text-base font-medium"
          variant={isAvailable ? (customizationAvailable ? "secondary" : "default") : "outline"}
        >
          {isAvailable ? (
            customizationAvailable ? "View Options" : "Add to Cart"
          ) : (
            "Unavailable"
          )}
          {isAvailable && (
            customizationAvailable ? (
              <Wand2 className="ml-2 h-5 w-5" />
            ) : (
              <ShoppingCart className="ml-2 h-5 w-5" />
            )
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;
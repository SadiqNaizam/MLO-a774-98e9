import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Standard shadcn/ui utility

interface CuisineFilterChipProps {
  /** The text label to display on the chip (e.g., "Italian", "Spicy"). */
  label: string;
  /** Whether the chip is currently selected. */
  isSelected: boolean;
  /** Callback function triggered when the chip is clicked, usually to toggle its selection state. */
  onToggle: () => void;
  /** Optional callback function. If provided, a dismiss (X) icon is shown, and this function is called when the icon is clicked. */
  onRemove?: () => void;
  /** Optional additional class names for custom styling. */
  className?: string;
}

const CuisineFilterChip: React.FC<CuisineFilterChipProps> = ({
  label,
  isSelected,
  onToggle,
  onRemove,
  className,
}) => {
  console.log(`CuisineFilterChip loaded for: ${label}, selected: ${isSelected}`);

  const handleChipKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the main chip's onToggle from firing
    if (onRemove) {
      onRemove();
    }
  };

  const handleRemoveKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation(); // Prevent the main chip's onToggle from firing
      if (onRemove) {
        onRemove();
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onToggle}
      onKeyDown={handleChipKeyDown}
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer select-none whitespace-nowrap',
        isSelected
          ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
          : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-input',
        onRemove ? 'pr-2' : '', // Adjust right padding if remove button is present
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove filter ${label}`}
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          className={cn(
            'ml-1.5 -mr-0.5 flex h-4 w-4 items-center justify-center rounded-full',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
             isSelected 
               ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10' 
               : 'text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted/20'
          )}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default CuisineFilterChip;
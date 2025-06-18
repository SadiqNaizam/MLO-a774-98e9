import React from 'react';
import { PackageCheck, ChefHat, Truck, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming 'cn' is available for class merging

// Define the possible statuses for an order
export type OrderStatus = 'ORDER_CONFIRMED' | 'PREPARING_FOOD' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface StepConfig {
  id: OrderStatus;
  label: string;
  icon: React.ElementType;
}

const steps: StepConfig[] = [
  { id: 'ORDER_CONFIRMED', label: 'Order Confirmed', icon: PackageCheck },
  { id: 'PREPARING_FOOD', label: 'Preparing Food', icon: ChefHat },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

interface OrderTrackingStepperProps {
  currentStatus: OrderStatus;
  className?: string;
}

const OrderTrackingStepper: React.FC<OrderTrackingStepperProps> = ({ currentStatus, className }) => {
  console.log('OrderTrackingStepper loaded with currentStatus:', currentStatus);

  const currentStepIndex = steps.findIndex(step => step.id === currentStatus);

  return (
    <div className={cn("w-full px-4 sm:px-0", className)}>
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          let iconColorClass = 'text-gray-400';
          let textColorClass = 'text-gray-500';
          let ringColorClass = 'ring-gray-300';
          let IconComponent = step.icon;

          if (isCompleted) {
            iconColorClass = 'text-white';
            textColorClass = 'text-green-600';
            ringColorClass = 'bg-green-500 ring-green-500';
          } else if (isActive) {
            iconColorClass = 'text-white';
            textColorClass = 'text-blue-600 font-semibold';
            ringColorClass = 'bg-blue-500 ring-blue-500 animate-pulse';
          } else { // isPending
             IconComponent = Circle; // Use a generic circle for pending steps before icon changes
             iconColorClass = 'text-gray-400'; // Or step.icon if we want to show future icons dimly
             textColorClass = 'text-gray-400';
             ringColorClass = 'ring-gray-300';
          }

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center w-1/4">
                <div
                  className={cn(
                    'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ring-2 transition-all duration-300',
                    ringColorClass,
                    (isCompleted || isActive) ? 'bg-opacity-100' : 'bg-gray-100'
                  )}
                >
                  <IconComponent
                    className={cn('w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300', iconColorClass)}
                  />
                </div>
                <p
                  className={cn(
                    'mt-2 text-xs sm:text-sm leading-tight min-h-[2.5rem] sm:min-h-[2.75rem] transition-colors duration-300',
                    textColorClass
                  )}
                >
                  {step.label}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mt-5 sm:mt-6 h-0.5 relative">
                   <div className={cn(
                      "absolute top-0 left-0 h-full w-full",
                      isCompleted || isActive ? 'bg-green-500' : 'bg-gray-300'
                    )}
                    style={{
                        width: (isCompleted || (isActive && currentStepIndex > index)) ? '100%' : '0%',
                        transition: 'width 0.5s ease-in-out'
                    }}
                    />
                   <div className={cn(
                      "absolute top-0 left-0 h-full w-full",
                       'bg-gray-300'
                    )}
                    />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackingStepper;
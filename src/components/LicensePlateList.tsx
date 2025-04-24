
import React from 'react';
import { Check, X } from 'lucide-react';
import { StateData } from '@/utils/stateData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LicensePlateListProps {
  states: StateData[];
  onToggleState: (stateId: string) => void;
}

const LicensePlateList: React.FC<LicensePlateListProps> = ({ states, onToggleState }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">License Plates</h2>
      
      <ScrollArea className="h-[300px] sm:h-[400px] md:h-[600px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {states.map((state) => (
            <Button
              key={state.id}
              variant="outline"
              className={cn(
                "license-plate min-h-[4.5rem] p-2",
                state.spotted && "spotted"
              )}
              onClick={() => onToggleState(state.id)}
            >
              <div className="absolute top-1 right-1">
                {state.spotted ? (
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-700" />
                ) : (
                  <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-xs sm:text-sm font-normal truncate max-w-full">
                  {state.name}
                </span>
                <span className="text-base sm:text-xl font-bold">
                  {state.abbreviation}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LicensePlateList;

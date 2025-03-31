
import React from 'react';
import { MapPin } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-4 border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MapPin className="h-8 w-8 text-secondary" strokeWidth={3} />
            <h1 className="text-3xl font-bold text-primary">License Plate Game</h1>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Spot license plates from all 50 states (plus DC) on your road trip!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

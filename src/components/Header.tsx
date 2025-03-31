
import React from 'react';
import { MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="py-4 border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MapPin className="h-8 w-8 text-secondary" strokeWidth={3} />
            <h1 className="text-3xl font-bold text-primary">License Plate Game</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground hidden md:block">
              Spot license plates from all 50 states (plus DC) on your road trip!
            </p>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

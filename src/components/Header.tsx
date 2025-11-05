
import React from 'react';
import { LogOut, User } from 'lucide-react';
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
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/91df8de2-1492-4b95-a807-381c858ee9f8.png" 
                alt="Plate Play Palooza Logo" 
                className="h-12 md:h-16"
              />
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground hidden md:block">
              Spot license plates from all US states (plus DC) and Canadian provinces on your road trip!
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


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Temporary mock user for bypassing authentication
  const mockUser = {
    id: 'mock-user-id',
    email: 'demo@example.com',
    email_verified: true,
  } as User;

  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Modify existing methods to be no-ops or return immediately
  const signIn = async () => {
    setUser(mockUser);
    navigate('/');
  };

  const signUp = async () => {
    setUser(mockUser);
    navigate('/');
  };

  const signOut = async () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user: mockUser, 
      session: null, 
      isLoading: false, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

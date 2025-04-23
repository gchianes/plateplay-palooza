
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
  // Create a proper UUID format mock user ID
  const mockUserId = '00000000-0000-4000-a000-000000000000'; // Valid UUID format
  
  // Create a proper mock user that satisfies the User type
  const mockUser = {
    id: mockUserId,
    email: 'demo@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    role: '',
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    last_sign_in_at: new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    email_change_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    phone: null,
    recovery_sent_at: null,
    identities: [],
    factors: [],
    updated_at: new Date().toISOString(),
    banned_until: null,
    confirmation_sent_at: null,
    has_active_subscription: false,
    deleted_at: null,
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

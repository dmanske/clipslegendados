import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = React.useRef<string | null>(null);
  const initializingRef = React.useRef(false);

  useEffect(() => {
    console.log('[AuthContext] useEffect triggered');
    
    if (!supabase) {
      console.log('[AuthContext] No supabase, setting loading to false');
      setLoading(false);
      return;
    }

    // Previne múltiplas inicializações simultâneas
    if (initializingRef.current) {
      console.log('[AuthContext] Already initializing, skipping...');
      return;
    }

    initializingRef.current = true;
    let mounted = true;
    let isInitializing = true;

    // Get initial session FIRST
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[AuthContext] Initial session check:', session?.user?.email, error);

        if (!mounted) return;

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
          setLoading(false);
          isInitializing = false;
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
        
        isInitializing = false;
      } catch (error) {
        console.error('[AuthContext] Error in initSession:', error);
        if (mounted) {
          setLoading(false);
          isInitializing = false;
        }
      }
    };

    // Listen for auth changes - NÃO usar async no callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session?.user?.email, 'isInitializing:', isInitializing);

      if (!mounted) return;
      
      // Ignora eventos durante inicialização
      if (isInitializing) {
        console.log('[AuthContext] Ignoring event during initialization');
        return;
      }

      // Ignora INITIAL_SESSION pois já foi tratado no initSession
      if (event === 'INITIAL_SESSION') {
        console.log('[AuthContext] Ignoring INITIAL_SESSION event');
        return;
      }

      if (event === 'SIGNED_IN') {
        setSession(session);
        setUser(session?.user ?? null);
        // Usar setTimeout para evitar deadlock com Supabase
        if (session?.user) {
          setTimeout(() => {
            if (mounted) fetchProfile(session.user.id);
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('[AuthContext] Token refreshed - updating session only');
        setSession(session);
        // Não buscar profile no refresh de token
      }
    });

    initSession();

    return () => {
      console.log('[AuthContext] Cleanup - unmounting');
      mounted = false;
      initializingRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = React.useCallback(async (userId: string, retryCount = 0) => {
    if (fetchingRef.current === userId && retryCount === 0) {
      console.log('[AuthContext] Already fetching profile for', userId);
      return;
    }

    console.log('[AuthContext] fetchProfile called for userId:', userId, 'retry:', retryCount);

    if (retryCount === 0) {
      fetchingRef.current = userId;
    }

    if (!supabase) {
      console.log('[AuthContext] No supabase client, setting loading to false');
      setLoading(false);
      fetchingRef.current = null;
      return;
    }

    try {
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('[AuthContext] Profile fetch result:', { profileData, profileError });

      if (profileError) {
        console.error('[AuthContext] Error fetching profile:', profileError);
        setLoading(false);
        fetchingRef.current = null;
        return;
      }

      // Se o perfil não existe, cria manualmente
      if (!profileData) {
        if (retryCount < 2) {
          // Tenta buscar novamente após um delay (apenas se não encontrou)
          console.log('[AuthContext] Profile not found, retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, retryCount + 1);
        }

        console.log('[AuthContext] Profile not found after retries, creating manually');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('[AuthContext] User metadata:', user.user_metadata);
          const newProfile = {
            id: userId,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email,
            role: 'user',
          };

          console.log('[AuthContext] Attempting to create profile:', newProfile);
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) {
            console.error('[AuthContext] Error creating profile:', createError);
            // Última tentativa de buscar
            const { data: retryProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
            profileData = retryProfile;
          } else {
            console.log('[AuthContext] Profile created successfully:', createdProfile);
            profileData = createdProfile;
          }
        }
      }

      if (profileData) {
        // Usa o campo role do profile
        const roles = profileData.role ? [profileData.role] : ['user'];

        setProfile({
          ...profileData,
          roles
        } as UserProfile);
        console.log('[AuthContext] Profile set successfully, setting loading to false');
      } else {
        console.log('[AuthContext] No profile data, setting loading to false anyway');
      }
    } catch (error) {
      console.error('[AuthContext] Error fetching profile:', error);
    } finally {
      console.log('[AuthContext] fetchProfile finally block, setting loading to false');
      setLoading(false);
      if (retryCount === 0 || retryCount >= 2) {
        fetchingRef.current = null;
      }
    }
  }, []);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    isAdmin: profile?.roles?.includes('admin') || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

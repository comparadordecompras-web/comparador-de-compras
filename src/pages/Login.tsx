import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { showSuccess } from '../utils/toast';

const Login: React.FC = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        showSuccess('Login realizado com sucesso! Redirecionando...');
      } else if (event === 'SIGNED_OUT') {
        showSuccess('Você saiu da sua conta.');
      } else if (event === 'USER_UPDATED') {
        showSuccess('Seu perfil foi atualizado.');
      } else if (event === 'PASSWORD_RECOVERY') {
        showSuccess('Verifique seu e-mail para redefinir a senha.');
      } else if (event === 'MFA_CHALLENGE_VERIFIED') {
        showSuccess('Verificação de MFA bem-sucedida.');
      }
      
      // Handle potential errors during auth flow (e.g., invalid email/password)
      // Note: Auth UI handles most input errors, but this catches broader issues.
      if (session?.user && event === 'SIGNED_IN') {
        // The session context handles the redirect, we just show the toast.
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-brand-dark mb-6">
          Acesse o Comparador
        </h1>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1D4ED8', // brand-primary
                  brandAccent: '#10B981', // brand-secondary
                },
              },
            },
          }}
          theme="light"
          view="sign_in" // Force initial view to sign_in to prevent routing issues
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu e-mail',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              sign_up: {
                email_label: 'Seu e-mail',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                link_text: 'Já tem uma conta? Faça login',
              },
              forgotten_password: {
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

    const supabaseUrl = "https://iccsymcldmrjybyukqbv.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljY3N5bWNsZG1yanlieXVrcWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQwNTAsImV4cCI6MjA1OTY3MDA1MH0.yzmH4-GQQgLG1wJAGRwvo19AV-qwIwCy56Q0M78l7u0";

    const supabase = createClient(supabaseUrl, supabaseKey);

    async function registrarVisita() {
      try {
        const cidade = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dispositivo = navigator.userAgent;

        const { error } = await supabase.from('visitas').insert([{
          cidade: cidade,
          dispositivo: dispositivo,
          criado_em: new Date().toISOString(),
        }]);

        if (error) throw error;
        console.log('Visita registrada com sucesso');
      } catch (err) {
        console.error('Erro ao registrar visita:', err.message);
      }
    }

    registrarVisita();
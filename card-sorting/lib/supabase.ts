import { createClient } from '@supabase/supabase-js';
import { CardSortingSubmission } from '@/types/card-sorting';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Salva a submissão de card sorting no Supabase (se configurado)
 * e também armazena no localStorage para redundância e auditoria.
 */
export async function saveCardSortingSubmission(submission: CardSortingSubmission): Promise<{
  success: boolean;
  persistedToSupabase: boolean;
  error?: string;
  data?: any;
}> {
  // Salva cópia local resiliente
  try {
    const existing = JSON.parse(localStorage.getItem('inema_card_sorting_history') || '[]');
    existing.unshift({
      ...submission,
      savedLocallyAt: new Date().toISOString()
    });
    localStorage.setItem('inema_card_sorting_history', JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.warn('Erro ao salvar localmente no browser:', err);
  }

  // Se Supabase estiver conectado, persiste na tabela
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('card_sorting_submissions')
        .insert([
          {
            participant_name: submission.participant_name,
            participant_department: submission.participant_department,
            submitted_at: submission.submitted_at,
            total_cards: submission.summary.total_cards,
            total_groups: submission.summary.total_groups,
            assigned_percentage: submission.summary.assigned_percentage,
            structure_payload: submission.structure_payload,
            summary: submission.summary,
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao persistir no Supabase:', error);
        return {
          success: true,
          persistedToSupabase: false,
          error: error.message
        };
      }

      return {
        success: true,
        persistedToSupabase: true,
        data
      };
    } catch (err: any) {
      console.error('Falha de rede ao conectar com Supabase:', err);
      return {
        success: true,
        persistedToSupabase: false,
        error: err?.message || 'Falha de conexão com Supabase'
      };
    }
  }

  // Caso Supabase ainda não tenha .env preenchido, sucesso garantido com mock/localStorage
  return {
    success: true,
    persistedToSupabase: false
  };
}

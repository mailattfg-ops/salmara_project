import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";

interface SettingsState {
  taxPercentage: number;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  setTaxPercentage: (percentage: number) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      taxPercentage: 18, // Default fallback
      isLoading: false,

      fetchSettings: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase
            .from('admin_settings')
            .select('value')
            .eq('key', 'tax_percentage')
            .maybeSingle();

          if (data && data.value) {
            const val = parseFloat(data.value as string);
            if (!isNaN(val)) {
              set({ taxPercentage: val });
            }
          }
        } catch (error) {
          console.error("Error fetching tax settings:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      setTaxPercentage: async (percentage: number) => {
        set({ isLoading: true });
        try {
          const { error } = await supabase
            .from('admin_settings')
            .update({ value: percentage.toString(), updated_at: new Date().toISOString() })
            .eq('key', 'tax_percentage');

          if (error) throw error;
          
          set({ taxPercentage: percentage });
          return true;
        } catch (error) {
          console.error("Error updating tax settings:", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'salmara-admin-settings',
      storage: createJSONStorage(() => localStorage),
      // Only persist the tax percentage, not the loading state
      partialize: (state) => ({ taxPercentage: state.taxPercentage }),
    }
  )
);

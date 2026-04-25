import React, { useState, useEffect } from "react";
import { 
  Percent, 
  Save, 
  Loader2, 
  ShieldCheck, 
  Info,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { m } from "framer-motion";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "sonner";

const AdminExtraCharges = () => {
  const { taxPercentage, setTaxPercentage, fetchSettings, isLoading } = useSettingsStore();
  const [inputValue, setInputValue] = useState(taxPercentage.toString());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setInputValue(taxPercentage.toString());
  }, [taxPercentage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPercentage = parseFloat(inputValue);

    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
      toast.error("Invalid tax percentage", {
        description: "Please enter a value between 0 and 100."
      });
      return;
    }

    setIsSaving(true);
    const success = await setTaxPercentage(newPercentage);
    setIsSaving(false);

    if (success) {
      toast.success("Tax Configuration Updated", {
        description: `Global tax rate is now set to ${newPercentage}% in the database.`
      });
    } else {
      toast.error("Update failed", {
        description: "Could not sync with Supabase. Please check your connection."
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <m.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[#C5A059] font-sans-clean text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            Configuration
          </m.p>
          <m.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-medium text-[#1A2E35]"
          >
            Extra Charges
          </m.h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Card */}
        <div className="lg:col-span-2 space-y-8">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#F2EDE4] shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A7A5C]/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            
            <form onSubmit={handleSave} className="relative z-10 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-[#5A7A5C]/10 rounded-2xl text-[#5A7A5C]">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-medium text-[#1A2E35]">Tax Configuration</h3>
                  <p className="text-xs text-[#1A2E35]/40 font-sans-clean">Define the global GST/Tax percentage applied to all orders.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 ml-1">
                  Tax Percentage (%)
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    step="0.01"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-[#FDFBF7] border-2 border-[#F2EDE4] rounded-2xl px-6 py-4 text-2xl font-display font-medium text-[#1A2E35] focus:outline-none focus:border-[#5A7A5C] focus:bg-white transition-all placeholder:text-[#1A2E35]/20"
                    placeholder="18.00"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#1A2E35]/20 font-display text-xl">
                    %
                  </div>
                </div>
                <p className="text-[11px] text-[#1A2E35]/40 italic leading-relaxed max-w-md ml-1">
                  * This value will be used to calculate taxes during checkout. Changes are applied instantly across the store.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#1A2E35] text-white px-8 py-4 rounded-2xl font-bold text-xs tracking-widest uppercase hover:bg-[#5A7A5C] transition-all shadow-xl shadow-[#1A2E35]/10 disabled:opacity-50 flex items-center gap-3 group"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  )}
                  {isSaving ? "Saving..." : "Update Settings"}
                </button>
                
                {inputValue !== taxPercentage.toString() && !isSaving && (
                  <m.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest flex items-center gap-2"
                  >
                    <AlertCircle className="h-3 w-3" /> Unsaved changes
                  </m.span>
                )}
              </div>
            </form>
          </m.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#F2EDE4] space-y-4"
            >
              <div className="h-10 w-10 bg-white rounded-xl border border-[#F2EDE4] flex items-center justify-center text-[#5A7A5C]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-display font-medium text-[#1A2E35]">Legal Compliance</h4>
              <p className="text-xs text-[#1A2E35]/60 leading-relaxed font-sans-clean">
                Ensure your tax rates align with the current GST regulations for Ayurvedic products in your region. Most supplements fall under the 12% or 18% slab.
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#FDFBF7] rounded-3xl p-8 border border-[#F2EDE4] space-y-4"
            >
              <div className="h-10 w-10 bg-white rounded-xl border border-[#F2EDE4] flex items-center justify-center text-[#C5A059]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-display font-medium text-[#1A2E35]">Dynamic Updates</h4>
              <p className="text-xs text-[#1A2E35]/60 leading-relaxed font-sans-clean">
                Updating the tax here will automatically adjust the final pricing on the cart and user dashboard for all active customers.
              </p>
            </m.div>
          </div>
        </div>

        {/* Sidebar Help Card */}
        <div className="space-y-6">
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#1A2E35] rounded-[2.5rem] p-8 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#C5A059]/20 transition-all duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Info className="h-6 w-6 text-[#C5A059]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-display font-medium text-white">How it works</h4>
                <p className="text-sm text-white/40 leading-relaxed italic">
                  "The tax percentage is applied to the subtotal of the cart. For example, an 18% tax on ₹1000 would add ₹180 to the final order amount."
                </p>
              </div>
              <div className="pt-4">
                <div className="p-4 bg-white/5 rounded-2xl space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                    <span>Example Subtotal</span>
                    <span>₹1,000.00</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                    <span>Tax ({inputValue}%)</span>
                    <span>₹{(1000 * (parseFloat(inputValue) || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white">
                    <span>Total Estimate</span>
                    <span>₹{(1000 * (1 + (parseFloat(inputValue) || 0) / 100)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
};

export default AdminExtraCharges;

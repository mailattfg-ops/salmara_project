import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type ShopifyProduct } from "@/lib/shopifyAdmin";
import { Image } from "@/components/ui/Image";
import { ShoppingCart, Loader2, Leaf, X, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickVariantSelectProps {
  product: ShopifyProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ShopifyProduct, selectedVariantIdx: number, selectedMetafieldIdx: number, quantity: number) => Promise<void>;
  onBuyNow: (product: ShopifyProduct, selectedVariantIdx: number, selectedMetafieldIdx: number, quantity: number) => Promise<void>;
}

const QuickVariantSelect = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}: QuickVariantSelectProps) => {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedMetafieldOptionIdx, setSelectedMetafieldOptionIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) return null;

  const variants = product.node.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIdx]?.node;
  const hasMultipleVariants = variants.length > 1 && !(variants.length === 1 && variants[0].node.title === "Default Title");

  const getMetafieldValue = (keyMatch: string) => {
    if (!product.node.metafields?.edges) return null;
    const cleanMatch = keyMatch.toLowerCase().replace(/[^a-z0-9]/g, '');
    const node = product.node.metafields.edges.find((e: any) => {
      const rawKey = e.node.key.toLowerCase();
      const cleanKey = rawKey.replace(/[^a-z0-9]/g, '');
      return cleanKey === cleanMatch || rawKey === keyMatch;
    })?.node;
    return node ? node.value : null;
  };

  const parseMetafieldParts = (value: string | null) =>
    (value || "")
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

  const metafieldNetQuantities = parseMetafieldParts(getMetafieldValue("net_quantity") || getMetafieldValue("quantity"));
  const metafieldPrices = parseMetafieldParts(getMetafieldValue("price") || getMetafieldValue("selling_price"));
  const metafieldOptionsCount = Math.max(metafieldNetQuantities.length, metafieldPrices.length);
  const usesMetafieldVariantOptions = !hasMultipleVariants && metafieldOptionsCount > 1;

  const selectedMetafieldPriceRaw = metafieldPrices[selectedMetafieldOptionIdx] || metafieldPrices[0] || "";
  const selectedMetafieldPrice = Number((selectedMetafieldPriceRaw || "").replace(/[^\d.]/g, ""));
  const hasValidMetafieldPrice = Number.isFinite(selectedMetafieldPrice) && selectedMetafieldPrice > 0;

  const displayPrice = (hasValidMetafieldPrice && usesMetafieldVariantOptions)
    ? selectedMetafieldPrice
    : parseFloat(selectedVariant?.price?.amount || "0");

  const handleAction = async (action: 'cart' | 'buy') => {
    setIsProcessing(true);
    try {
      if (action === 'cart') {
        await onAddToCart(product, selectedVariantIdx, selectedMetafieldOptionIdx, quantity);
      } else {
        await onBuyNow(product, selectedVariantIdx, selectedMetafieldOptionIdx, quantity);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-display font-medium text-[#1A2E35]">Select Option</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#FDFBF7] border border-[#F2EDE4] shrink-0">
              {product.node.images.edges[0]?.node ? (
                <Image 
                  src={product.node.images.edges[0].node.url} 
                  alt={product.node.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-[#5A7A5C]/20" />
                </div>
              )}
            </div>
            <div className="space-y-1 py-1">
              <h3 className="font-display font-medium text-[#1A2E35] text-lg leading-tight line-clamp-2">
                {product.node.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[#C5A059] font-sans-clean font-bold text-xl">
                  ₹{displayPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {(hasMultipleVariants || usesMetafieldVariantOptions) && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A2E35]/40 px-1">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {hasMultipleVariants ? (
                  variants.map((v: any, i: number) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      disabled={!v.node.availableForSale}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest",
                        i === selectedVariantIdx
                          ? 'bg-[#1A2E35] border-[#1A2E35] text-white shadow-md'
                          : 'bg-white border-[#F2EDE4] text-[#1A2E35] hover:border-[#1A2E35]/30',
                        !v.node.availableForSale && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      {v.node.title}
                    </button>
                  ))
                ) : (
                  Array.from({ length: metafieldOptionsCount }).map((_, i) => {
                    const label = metafieldNetQuantities[i] || `Option ${i + 1}`;
                    return (
                      <button
                        key={`meta-option-${i}`}
                        onClick={() => setSelectedMetafieldOptionIdx(i)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest",
                          i === selectedMetafieldOptionIdx
                            ? 'bg-[#1A2E35] border-[#1A2E35] text-white shadow-md'
                            : 'bg-white border-[#F2EDE4] text-[#1A2E35] hover:border-[#1A2E35]/30'
                        )}
                      >
                        {label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white border border-[#F2EDE4] rounded-2xl px-2 min-h-[56px]">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="p-4 text-[#1A2E35]/30 hover:text-[#1A2E35] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center font-display font-medium text-[#1A2E35] text-lg">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="p-4 text-[#1A2E35]/30 hover:text-[#1A2E35] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
            <button
              onClick={() => handleAction('cart')}
              disabled={isProcessing || (hasMultipleVariants && !selectedVariant?.availableForSale)}
              className="w-full bg-white border-2 border-[#1A2E35] text-[#1A2E35] py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
            </button>
            <button
              onClick={() => handleAction('buy')}
              disabled={isProcessing || (hasMultipleVariants && !selectedVariant?.availableForSale)}
              className="w-full bg-[#1A2E35] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#1A2E35]/90 transition-all shadow-xl shadow-[#1A2E35]/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy Now Directly"}
            </button>
          </div>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickVariantSelect;

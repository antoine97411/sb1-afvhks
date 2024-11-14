"use client";

import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStore } from '@/lib/store';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProductSelectorProps {
  onManualMode?: () => void;
}

export function ProductSelector({ onManualMode }: ProductSelectorProps) {
  const { products, selectedProductId, setSelectedProduct, loadProductData } = useStore();
  
  useEffect(() => {
    if (selectedProductId) {
      loadProductData(selectedProductId);
    }
  }, [selectedProductId, loadProductData]);

  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedProductId || 'manual'}
        onValueChange={(value) => {
          if (value === 'manual') {
            setSelectedProduct(null);
            if (onManualMode) onManualMode();
          } else {
            setSelectedProduct(value);
          }
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Sélectionner un produit ou saisie manuelle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Saisie Manuelle</SelectItem>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name} - {product.price.toFixed(2)}€
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push('/products')}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
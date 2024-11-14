"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomCost {
  id: string;
  name: string;
  value: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  manufacturingCost: number;
  shippingCost: number;
  customCosts: CustomCost[];
}

interface ProductCosts {
  productName: string;
  sellingPrice: number;
  manufacturingCost: number;
  shippingCost: number;
  customCosts: CustomCost[];
}

interface AdMetrics {
  budget: number;
  conversionRate: number;
  cpc: number;
  averageCartValue: number;
  costPerSale: number;
}

interface StoreState {
  products: Product[];
  selectedProductId: string | null;
  productCosts: ProductCosts;
  adMetrics: AdMetrics;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setSelectedProduct: (id: string | null) => void;
  loadProductData: (id: string) => void;
  setProductCosts: (costs: Partial<ProductCosts>) => void;
  addCustomCost: (cost: CustomCost) => void;
  removeCustomCost: (id: string) => void;
  updateCustomCost: (id: string, updates: Partial<CustomCost>) => void;
  setAdMetrics: (metrics: Partial<AdMetrics>) => void;
  reset: () => void;
}

const initialState = {
  products: [],
  selectedProductId: null,
  productCosts: {
    productName: '',
    sellingPrice: 0,
    manufacturingCost: 0,
    shippingCost: 0,
    customCosts: [],
  },
  adMetrics: {
    budget: 0,
    conversionRate: 0,
    cpc: 1,
    averageCartValue: 50,
    costPerSale: 0,
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          selectedProductId: state.selectedProductId === id ? null : state.selectedProductId,
        })),
      setSelectedProduct: (id) =>
        set({ selectedProductId: id }),
      loadProductData: (id) => {
        const product = get().products.find((p) => p.id === id);
        if (product) {
          set((state) => ({
            productCosts: {
              productName: product.name,
              sellingPrice: product.price,
              manufacturingCost: product.manufacturingCost,
              shippingCost: product.shippingCost,
              customCosts: [...product.customCosts],
            },
          }));
        }
      },
      setProductCosts: (costs) =>
        set((state) => ({
          productCosts: { ...state.productCosts, ...costs },
        })),
      addCustomCost: (cost) =>
        set((state) => ({
          productCosts: {
            ...state.productCosts,
            customCosts: [...state.productCosts.customCosts, cost],
          },
        })),
      removeCustomCost: (id) =>
        set((state) => ({
          productCosts: {
            ...state.productCosts,
            customCosts: state.productCosts.customCosts.filter((cost) => cost.id !== id),
          },
        })),
      updateCustomCost: (id, updates) =>
        set((state) => ({
          productCosts: {
            ...state.productCosts,
            customCosts: state.productCosts.customCosts.map((cost) =>
              cost.id === id ? { ...cost, ...updates } : cost
            ),
          },
        })),
      setAdMetrics: (metrics) =>
        set((state) => ({
          adMetrics: { ...state.adMetrics, ...metrics },
        })),
      reset: () => set(initialState),
    }),
    {
      name: 'ecommerce-calculator',
    }
  )
);
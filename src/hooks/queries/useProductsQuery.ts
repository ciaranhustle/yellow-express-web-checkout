"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useProductsQuery = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api('/api/product');
      return response?.data?.products ?? [];
    },
  });
}; 

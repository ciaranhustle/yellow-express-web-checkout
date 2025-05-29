"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FETCH_APP_SETTINGS } from "@/lib/constants";

export const useAppSettings = () => {
  return useQuery<AppSettings, Error>({
    queryKey: [FETCH_APP_SETTINGS],
    queryFn: async () => {
      const response = await api("/api/appsettings");

      return response?.data?.appSettings ?? null;
    },
  });
};

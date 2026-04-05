"use client";

import { useState, useCallback } from "react";
import type { ScanResponse } from "@zhimiry/shared";
import api from "@/lib/api-client";

export function useScan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    const form = new FormData();
    form.append("image", file);
    try {
      const { data } = await api.post<ScanResponse>("/api/scan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch {
      setError("Scan failed");
      throw new Error("Scan failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { scan, loading, error };
}

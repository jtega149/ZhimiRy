"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScan } from "@/hooks/useScan";
import type { ScanResponse } from "@zhimiry/shared";
import { ScanResult } from "./ScanResult";
import { Loader2, Upload } from "lucide-react";

type ImageUploaderProps = {
  onSuccess?: (data: ScanResponse) => void;
};

export function ImageUploader({ onSuccess }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { scan, loading, error } = useScan();

  const onFile = useCallback((f: File | null) => {
    setResult(null);
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return f ? URL.createObjectURL(f) : null;
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith("image/")) onFile(f);
    },
    [onFile]
  );

  const submit = async () => {
    if (!file) return;
    const data = await scan(file);
    setResult(data);
    onSuccess?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload an item</CardTitle>
        <CardDescription>Drag and drop, choose a file, or use your camera.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50"
          onClick={() => inputRef.current?.click()}
          role="presentation"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click or drop an image here</p>
        </div>

        {preview && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-h-64 w-full rounded-md object-contain" />
            <Button onClick={submit} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning…
                </>
              ) : (
                "Run AI scan"
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {result && <ScanResult data={result} />}
      </CardContent>
    </Card>
  );
}

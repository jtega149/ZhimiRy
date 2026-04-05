import { ImageUploader } from "@/components/scan/ImageUploader";

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">AI scan</h1>
      <p className="text-sm text-muted-foreground">Upload a clear photo of an item to get disposal guidance.</p>
      <ImageUploader />
    </div>
  );
}

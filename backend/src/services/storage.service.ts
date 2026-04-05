import { createClient } from "@supabase/supabase-js";
import type { Express } from "express";

export async function uploadScanImage(
  file: Express.Multer.File,
  userId: string
): Promise<string> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }

  const supabase = createClient(url, key);
  const fileName = `${userId}/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage.from("scan-images").upload(fileName, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from("scan-images").getPublicUrl(data.path);
  return urlData.publicUrl;
}

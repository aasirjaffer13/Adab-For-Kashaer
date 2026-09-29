import type { Json } from "@/integrations/supabase/types";

export type TextMetadata = {
  text?: string;
  fontSize?: number;
};

export function readTextMetadata(metadata: Json | null | undefined): TextMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return {};
  return metadata as unknown as TextMetadata;
}

export interface BoardItem {
  id: string;
  board_id: string;
  type: string;
  image_url: string | null;
  source_url: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  z_index: number;
  notes: string | null;
  tags: string[] | null;
  metadata: Json | null;
  created_at: string;
}

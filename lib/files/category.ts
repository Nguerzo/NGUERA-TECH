import { FileImage, FileText, File as FileIcon, type LucideIcon } from "lucide-react";

export type FileCategory = "image" | "pdf" | "document";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"];
const PDF_EXT = ["pdf"];

export function categorize(fileName: string): FileCategory {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXT.includes(ext)) return "image";
  if (PDF_EXT.includes(ext)) return "pdf";
  return "document";
}

export const CATEGORY_ICON: Record<FileCategory, LucideIcon> = {
  image: FileImage,
  pdf: FileText,
  document: FileIcon,
};

export const CATEGORY_LABEL: Record<FileCategory, string> = {
  image: "Images",
  pdf: "PDF",
  document: "Documents",
};

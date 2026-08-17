"use client";

import React, { useRef, useState } from "react";
import { Upload, Link as LinkIcon, CheckCircle, Loader2 } from "lucide-react";
import { compressImageFile } from "@/lib/image-compressor";

export interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: "video" | "square" | "portrait" | "banner";
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  placeholder = "https://images.unsplash.com/… or upload local file",
  aspectRatio = "video",
  className = "",
}: ImageUploaderProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlText, setUrlText] = useState(() => (value && !value.startsWith("data:") ? value : ""));
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    try {
      setIsCompressing(true);
      const dataUrl = await compressImageFile(file);
      onChange(dataUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to process image file.";
      setError(message);
    } finally {
      setIsCompressing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass = {
    video: "aspect-[16/9]",
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    banner: "aspect-[21/9]",
  }[aspectRatio];

  const isLikelyHttpUrl = (input: string) => /^https?:\/\//i.test(input.trim());

  const handleUrlValue = (rawValue: string) => {
    const nextValue = rawValue.trim();
    setUrlText(nextValue);
    setError(null);

    if (!nextValue) {
      onChange("");
      return;
    }

    if (nextValue.startsWith("data:")) {
      onChange(nextValue);
      return;
    }

    if (!isLikelyHttpUrl(nextValue)) {
      setError("Please enter a valid image URL starting with http:// or https://");
    }

    onChange(nextValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header & Tabs */}
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">
            {label}
          </span>
        )}
        <div className="flex rounded-lg border border-[#eadcc6] bg-[#fffaf5] p-0.5 text-[10px] font-bold uppercase">
          <button
            type="button"
            onClick={() => {
              setTab("upload");
              setError(null);
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
              tab === "upload"
                ? "bg-[#111111] text-white shadow-xs"
                : "text-[#111111]/60 hover:text-[#111111]"
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("url");
              setError(null);
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-1 transition ${
              tab === "url"
                ? "bg-[#111111] text-white shadow-xs"
                : "text-[#111111]/60 hover:text-[#111111]"
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Input Form based on Tab */}
      {tab === "upload" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            value=""
            onChange={onFileInputChange}
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition ${
              dragOver
                ? "border-[#f59e0b] bg-[#fff7eb]"
                : "border-[#eadcc6] bg-[#fffdf9] hover:border-[#f59e0b]/70 hover:bg-[#fffaf5]"
            }`}
          >
            {isCompressing ? (
              <div className="flex flex-col items-center justify-center py-2 text-[#a55d00]">
                <Loader2 className="h-6 w-6 animate-spin mb-1" />
                <p className="text-xs font-semibold">Optimizing and uploading image…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100/70 text-[#a55d00] mb-2">
                  <Upload className="h-4.5 w-4.5" />
                </div>
                <p className="text-xs font-semibold text-[#111111]">
                  Click to browse or drag & drop image file
                </p>
                <p className="mt-0.5 text-[10px] text-[#111111]/45">
                  PNG, JPG, WEBP, GIF (auto-optimized for instant display)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={urlText}
            onChange={(e) => handleUrlValue(e.target.value)}
            onBlur={() => {
              const trimmed = urlText.trim();
              setUrlText(trimmed);
              if (trimmed && !trimmed.startsWith("data:") && !isLikelyHttpUrl(trimmed)) {
                setError("Please enter a valid image URL starting with http:// or https://");
              }
              onChange(trimmed);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-[#eadcc6] bg-[#fffdf9] px-3.5 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20"
          />
        </div>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Preview Card */}
      {value && (
        <div className="relative overflow-hidden rounded-2xl border border-[#eadcc6] bg-[#111111]/5 p-1.5">
          <div className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-slate-900/10`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onLoad={() => setError(null)}
              onError={() => {
                if (value.startsWith("http")) {
                  setError("Preview is blocked by the remote host, but the URL is still saved. Try a direct image URL if needed.");
                  return;
                }
                setError("Image failed to load. Please verify file or URL.");
              }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between px-1.5 py-0.5 text-[10px]">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              {value.startsWith("data:") ? "Local Image Loaded" : "URL Image Loaded"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-bold text-[#a55d00] hover:underline"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="font-bold text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

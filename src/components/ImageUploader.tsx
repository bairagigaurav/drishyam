"use client";

import React, { useRef, useState } from "react";
import { Link as LinkIcon, CheckCircle, Upload } from "lucide-react";
import { compressImageFile } from "@/lib/image-compressor";
import { supabase } from "@/lib/supabase";

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
  placeholder = "https://images.unsplash.com/... or paste a second direct URL separated by a comma",
  aspectRatio = "video",
  className = "",
}: ImageUploaderProps) {
  const [urlText, setUrlText] = useState(() => (value && !value.startsWith("data:") ? value : ""));
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (file: File) => {
    setError(null);
    if (!supabase) {
      setError("Supabase is not configured. Add the public environment variables before uploading.");
      return;
    }

    setIsUploading(true);
    try {
      const compressedImage = await compressImageFile(file);
      const response = await fetch(compressedImage);
      const imageBlob = await response.blob();
      const filePath = `admin/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(filePath, imageBlob, { contentType: "image/jpeg", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("site-images").getPublicUrl(filePath);
      setUrlText(data.publicUrl);
      onChange(data.publicUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
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
        <div className="flex rounded-lg border border-blue-300 bg-blue-50/80 p-0.5 text-[10px] font-bold uppercase">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-700 px-3 py-1.5 flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <Upload className="h-3 w-3" />
            {isUploading ? "Uploading..." : "Upload image"}
          </button>
          <div className="text-blue-700 px-3 py-1.5 flex items-center gap-1 font-semibold border-l border-blue-200">
            <LinkIcon className="h-3 w-3" />
            <span>URL</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFileUpload(file);
          event.target.value = "";
        }}
      />

      {/* URL Input - Persistent for Deployment */}
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

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {/* Storage note */}
      {!value && (
        <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-3.5 text-[10px] text-blue-900">
          <p className="font-semibold">Images uploaded here are stored in Supabase Storage and remain available after deployment.</p>
          <p className="mt-1">You can also paste a public image URL below.</p>
        </div>
      )}

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
              {`Image URL Saved (Will persist after deployment)`}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange("")}
                className="font-bold text-red-600 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

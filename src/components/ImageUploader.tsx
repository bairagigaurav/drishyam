"use client";

import React, { useState } from "react";
import { Link as LinkIcon, CheckCircle } from "lucide-react";

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
  const [urlText, setUrlText] = useState(() => (value && !value.startsWith("data:") ? value : ""));
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex rounded-lg border border-blue-300 bg-blue-50/80 p-0.5 text-[10px] font-bold uppercase">
          <div className="text-blue-700 px-3 py-1.5 flex items-center gap-1 font-semibold">
            <LinkIcon className="h-3 w-3" />
            <span>Image URL (Persistent)</span>
          </div>
        </div>
      </div>

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

      {/* Critical Info - Why URL Only */}
      {!value && (
        <div className="rounded-lg border-2 border-red-400 bg-red-50/90 p-3.5 text-[10px] text-red-900 space-y-2">
          <p className="font-bold text-red-800">{"⚠️  CRITICAL: Local Uploads Don't Work After Deployment"}</p>
          <p>
            {`All images must be from direct URLs. Local file uploads disappear when the server restarts on free hosting. This is why you see no images after deployment.`}
          </p>
          <p className="font-semibold text-red-800">{"Step-by-step to save images that persist:"}</p>
          <ol className="ml-4 space-y-1.5 list-decimal text-red-800">
            <li><strong>Option 1 (Recommended):</strong> Use Cloudinary
              <ul className="ml-3 mt-0.5 text-[9px] list-disc">
                <li>Sign up free at cloudinary.com</li>
                <li>Upload image to Media Library</li>
                <li>Copy the image URL and paste here</li>
              </ul>
            </li>
            <li><strong>Option 2:</strong> Use Imgur
              <ul className="ml-3 mt-0.5 text-[9px] list-disc">
                <li>Go to imgur.com and upload image</li>
                <li>Right-click image → Copy image link</li>
                <li>Paste the URL here</li>
              </ul>
            </li>
            <li><strong>Option 3:</strong> Use imgbb.com (similar to Imgur)</li>
          </ol>
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

"use client";

import { usePreviewStore } from "@/lib/store";

export function LivePreview({ username }: { username: string }) {
  const { refreshKey } = usePreviewStore();

  const previewUrl = `/${username}`;

  return (
    <div className="sticky top-20">
      <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
      <div className="relative aspect-[9/16] w-full rounded-xl border-4 border-gray-300 bg-white">
        <iframe
          src={previewUrl}
          key={refreshKey}
          className="h-full w-full rounded-lg"
          title="Live Preview"
        />
      </div>
    </div>
  );
}

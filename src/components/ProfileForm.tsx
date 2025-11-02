"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePreviewStore } from "@/lib/store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Profile = {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

export function ProfileForm({
  initialProfile,
}: {
  initialProfile: Profile | null;
}) {
  const [displayName, setDisplayName] = useState(
    initialProfile?.displayName || ""
  );
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialProfile?.avatarUrl
  );
  const [isSaving, setIsSaving] = useState(false);
  const { triggerRefresh } = usePreviewStore();
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    await fetch("/api/profile", {
      method: "PATCH",
      body: formData,
    });

    setIsSaving(false);
    triggerRefresh();
    router.refresh();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={previewUrl || "/default-avatar.png"}
              alt="Avatar preview"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              <Input
                id="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
                className="cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short description about yourself..."
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

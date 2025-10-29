"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

type Theme = {
  backgroundColor: string;
};

const defaultTheme: Theme = {
  backgroundColor: "#ffffff",
};

export function AppearanceForm({
  initialTheme,
}: {
  initialTheme: Theme | null;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme || defaultTheme);
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (newColor: string) => {
    setTheme({ ...theme, backgroundColor: newColor });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await fetch("/api/theme", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    setIsSaving(false);
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="font-medium">Background Color</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-24 justify-start">
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: theme.backgroundColor }}
                    ></div>
                    <span className="ml-2">{theme.backgroundColor}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <HexColorPicker
                    color={theme.backgroundColor}
                    onChange={handleColorChange}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

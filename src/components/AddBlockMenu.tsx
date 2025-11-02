"use client";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { AddLinkModal } from "./AddLinkModal";
import { useState } from "react";
import { usePreviewStore } from "@/lib/store";

export function AddBlockMenu() {
  const [isLinkModalOpen, setLinkIsModalOpen] = useState(false);
  const { triggerRefresh } = usePreviewStore();

  const router = useRouter();

  const handleAddHeading = async () => {
    const response = await fetch("api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Your Heading Text", url: "#heading" }),
    });

    if (response.ok) {
      triggerRefresh();
      router.refresh();
    } else {
      alert("Failed to add heading");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 m-4" /> Add Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setLinkIsModalOpen(true)}>
            Add Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddHeading}>
            Add Heading
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddLinkModal
        isOpen={isLinkModalOpen}
        setIsOpen={setLinkIsModalOpen}
      ></AddLinkModal>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

type DeleteLinkButtonProps = {
  linkId: string;
};

export function DeleteLinkButton({ linkId }: DeleteLinkButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch(`/api/links?id=${linkId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to delete link");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" color="red" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this link
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone. This will permanently delete the link
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-black "
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

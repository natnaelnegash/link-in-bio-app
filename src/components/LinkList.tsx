/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Link } from "@/generated/prisma";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { UpdateLinkButton } from "./UpdateLinkButton";
import { DeleteLinkButton } from "./DeleteLinkButton";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { detectSocialPlatform } from "@/lib/socials";

function SortableLinkItem({ link }: { link: Link }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (link.url === "#heading") {
    // Render as a Heading
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between rounded-lg border bg-card p-4 touch-none"
      >
        <div className="flex items-center space-x-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-2"
            style={{ touchAction: "none" }}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          {/* For headings, the "title" is the main text */}
          <h3 className="font-semibold text-lg">{link.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <UpdateLinkButton link={link} />
          <DeleteLinkButton linkId={link.id} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border bg-card p-4"
    >
      <div className="flex items-center space-x-4">
        <div {...attributes} {...listeners} className="cursor-grab p-2">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        {(() => {
          const platform = detectSocialPlatform(link.url);
          console.log(platform);

          if (platform !== null) {
            return (
              <div
                className="w-2xs rounded-md p-4 text-white font-semibold"
                style={{
                  backgroundImage: `url(/socials/${platform}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="bg-white text-black opacity-80 border-white border-2 rounded-sm">
                  {link.title}
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <h3 className="font-semibold">{link.title}</h3>
                <a href={link.url} /* ... */>{link.url}</a>
              </div>
            );
          }
        })()}
      </div>
      <div className="flex items-center space-x-2">
        <UpdateLinkButton link={link} />
        <DeleteLinkButton linkId={link.id} />
      </div>
    </div>
  );
}

// return (
//   <div
//     ref={setNodeRef}
//     style={style}
//     className="flex items-center justify-between rounded-lg border bg-card p-4"
//   >
//     <div className="flex items-center space-x-4">
//       <div {...attributes} {...listeners} className="cursor-grab p-2">
//         <GripVertical className="h-5 w-5 text-muted-foreground" />
//       </div>
//       <div>
//         <h3 className="font-semibold">{link.title}</h3>
//         <a
//           href={link.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-sm text-muted-foreground"
//         >
//           {link.url}
//         </a>
//       </div>
//     </div>
//     <div>
//       <UpdateLinkButton link={link} />
//       <DeleteLinkButton linkId={link.id} />
//     </div>
//   </div>
// );

export default function LinkList({ initialLinks }: { initialLinks: Link[] }) {
  const [links, setLinks] = useState(initialLinks);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const reorderedLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(reorderedLinks);

      const payload = reorderedLinks.map((link, index) => ({
        id: link.id,
        order: index,
      }));

      await fetch("/api/links/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: payload }),
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={links} strategy={verticalListSortingStrategy}>
        <div className="mt-8 space-y-4">
          {links.length > 0 ? (
            links.map((link, index) => (
              <SortableLinkItem key={index} link={link} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              You have no links yet. Add one to get started!
            </p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

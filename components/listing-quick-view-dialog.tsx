"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

export function ListingQuickViewDialog({
    children,
}: Readonly<{ children: ReactNode }>) {
    const router = useRouter();

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) router.back();
            }}
        >
            <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-x-hidden overflow-y-auto p-0 sm:max-w-4xl">
                <DialogTitle className="sr-only">Vehicle quick view</DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    );
}
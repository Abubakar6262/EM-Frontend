"use client";
import Button from "@/components/ui/Button";
import { Grid, List } from "lucide-react";

interface EventHeaderProps {
    total: number;
    view: "grid" | "list";
    onToggle: (view: "grid" | "list") => void;
}

export default function EventHeader({ total, view, onToggle }: EventHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold">{total} Event Found</h2>
                <p className="text-sm text-muted-foreground">
                    Discover amazing events happening around you
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    variant={view === "grid" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onToggle("grid")}
                >
                    <Grid className="w-4 h-4" />
                </Button>

                <Button
                    variant={view === "list" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onToggle("list")}
                    className="hidden sm:flex"
                >
                    <List className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

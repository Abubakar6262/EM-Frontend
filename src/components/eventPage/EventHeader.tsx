"use client";
import Button from "@/components/ui/Button";
import { RootState } from "@/store";
import { Grid, List } from "lucide-react";
import { useSelector } from "react-redux";

interface EventHeaderProps {
    total: number;
    view: "grid" | "list";
    onToggle: (view: "grid" | "list") => void;
}

export default function EventHeader({ total, view, onToggle }: EventHeaderProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-semibold">{total} Event Found</h2>
                <p className="text-sm text-muted-foreground">
                    {user?.role !== "ORGANIZER"?"Discover amazing events happening around you":"Explore your events happening soon"}
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

import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import SidebarItem from "./side-item";

// This is sample data.
const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
        {
            title: "Main",
            url: "/",
            items: [
                {
                    title: "Home",
                    url: "#",
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className="w-full p-2">
                    <h1 className="text-2xl font-bold text-blue-500">
                        Tugas Akhir
                    </h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {/* We create a SidebarGroup for each parent. */}
                <SidebarItem data={data} />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}

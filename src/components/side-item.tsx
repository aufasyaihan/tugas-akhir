"use client";

import { usePathname } from "next/navigation";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar";

export default function SidebarItem({
    data,
}: Record<
    string,
    { navMain: { title: string; items: { title: string; url: string }[] }[] }
>) {
    const path = usePathname();
    return (
        <>
            {data.navMain.map((item) => (
                <SidebarGroup key={item.title}>
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {item.items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={path === item.url}
                                    >
                                        <a href={item.url}>{item.title}</a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    );
}

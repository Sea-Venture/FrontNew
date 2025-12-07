import * as React from "react"
import {
  Command,
  BookOpen,
  Compass,
  Map,
  Sparkles,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data for guide.
const data = {
  teams: [
    {
      name: "Guide Panel",
      logo: Command,
      plan: "Explorer",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/guide",
      icon: Compass,
      isActive: true,
    },
    {
      title: "Tutorials",
      url: "/guide/tutorials",
      icon: BookOpen,
    },
    {
      title: "Maps",
      url: "/guide/maps",
      icon: Map,
    },
    {
      title: "Resources",
      url: "/guide/resources",
      icon: Sparkles,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/guide/settings",
      icon: Settings2,
    },
  ],
}

export function GuideSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
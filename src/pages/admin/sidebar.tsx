import * as React from "react"
import {
  Command,
  Home,
  Inbox,
  LocateIcon,
  Settings2,
  Sparkles,
  Compass,
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

const data = {
  teams: [
    {
      name: "Admin Panel",
      logo: Command,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
      isActive: true,
    },
    {
      title: "Locations",
      url: "/admin/locations",
      icon: LocateIcon,
    },
    {
      title: "Guide Requests",
      url: "/admin/guide-requests",
      icon: Compass,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: Sparkles,
    },
    {
      title: "Security",
      url: "/admin/security",
      icon: Inbox,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ],
}

export function AdminSidebar({
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
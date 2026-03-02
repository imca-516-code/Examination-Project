"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Users,
  BarChart3,
  LogOut,
  GraduationCap,
  ClipboardList,
  Trophy,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useExamStore } from "@/lib/exam-store"

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/exams", label: "Exams", icon: FileText },
  { href: "/admin/questions", label: "Question Bank", icon: HelpCircle },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
]

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student", label: "Available Exams", icon: ClipboardList },
  { href: "/student/results", label: "My Results", icon: Trophy },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { state, logout } = useExamStore()

  const isAdmin = state.currentUser?.role === "admin"
  const links = isAdmin ? adminLinks : studentLinks

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              ExamPortal
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {state.currentUser?.role} Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href + link.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                  >
                    <a href={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarSeparator />
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {state.currentUser?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {state.currentUser?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {state.currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

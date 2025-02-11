import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconCalendar, IconSettings, IconUsers, IconVideo } from "@tabler/icons-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconHome className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Meetings",
      href: "/dashboard/meetings",
      icon: <IconVideo className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: <IconCalendar className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Participants",
      href: "/dashboard/participants",
      icon: <IconUsers className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <IconSettings className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarBody>
          <div className="flex flex-col gap-4">
            {sidebarLinks.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 
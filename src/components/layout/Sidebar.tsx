
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListChecks, 
  BarChart4, 
  Calendar, 
  User,
  PanelLeft
} from 'lucide-react';
import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/',
  },
  {
    label: 'Applications',
    icon: ListChecks,
    href: '/applications',
  },
  {
    label: 'Analytics',
    icon: BarChart4,
    href: '/analytics',
  },
  {
    label: 'Calendar',
    icon: Calendar,
    href: '/calendar',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <ShadcnSidebar>
      <SidebarContent className="py-4">
        <div className="px-3 mb-4">
          <SidebarTrigger />
        </div>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  tooltip={isCollapsed ? item.label : undefined}
                  isActive={isActive}
                  asChild
                >
                  <Link 
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;

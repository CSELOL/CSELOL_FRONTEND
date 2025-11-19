// src/components/layout/nav-config.ts

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export const publicNavItems: NavItem[] = [
  {
    title: "Início",
    href: "/",
  },
  {
    title: "Tabela",
    href: "/standings",
  },
  {
    title: "Times",
    href: "/teams",
  },
  {
    title: "Regulamento",
    href: "/rules",
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Minhas Partidas",
    href: "/matches",
  },
];
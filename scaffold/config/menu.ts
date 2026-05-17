/**
 * Left-sidebar menu definition.
 *
 * Each item maps to either:
 *  - a Vue Router `name` (preferred), or
 *  - an absolute `path`.
 *
 * Children render as nested items in the sidebar. Icons are passed
 * through to your <VnIcon /> (or the fallback) — use whatever icon
 * scheme your project uses (lucide name, material name, an emoji, etc).
 */
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  routeName?: string;
  path?: string;
  badge?: string | number;
  children?: MenuItem[];
  /** Hide from the menu without removing — useful for permission flags. */
  hidden?: boolean;
}

export const defaultMenu: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard',
    routeName: 'dashboard',
  },
  // Add your sections here. Example:
  // {
  //   id: 'users',
  //   label: 'Users',
  //   icon: 'users',
  //   children: [
  //     { id: 'users.list',  label: 'All users',  routeName: 'users-list' },
  //     { id: 'users.roles', label: 'Roles',      routeName: 'users-roles' },
  //   ],
  // },
];

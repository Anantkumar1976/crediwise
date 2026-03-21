/** Roles allowed to access `/admin` (must match RLS / business rules). */
export const STAFF_ROLES = ["advisor", "operations_executive", "super_admin"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_SET = new Set<string>(STAFF_ROLES);

export function isStaffRole(role: string | null | undefined): boolean {
  return role != null && STAFF_ROLE_SET.has(role);
}

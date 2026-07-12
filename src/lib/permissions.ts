// Client-side mirror of the backend's RBAC map (config/permissions.ts).
// This is a UX layer only — hides buttons/routes the user can't act on.
// The real enforcement is the backend's authorize() middleware; nothing
// here should ever be treated as a security boundary.
export enum Permission {
  USER_VIEW_ALL = "user:view_all",
  USER_UPDATE_STATUS = "user:update_status",
  JOB_CREATE = "job:create",
  JOB_UPDATE = "job:update",
  JOB_DELETE = "job:delete",
  TASK_VIEW_ALL = "task:view_all",
  TASK_REVIEW = "task:review",
  TASK_SUBMIT = "task:submit",
  TRANSACTION_VIEW_ALL = "transaction:view_all",
  TRANSACTION_VIEW_OWN = "transaction:view_own",
}

const RolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    Permission.USER_VIEW_ALL,
    Permission.USER_UPDATE_STATUS,
    Permission.JOB_CREATE,
    Permission.JOB_UPDATE,
    Permission.JOB_DELETE,
    Permission.TASK_VIEW_ALL,
    Permission.TASK_REVIEW,
    Permission.TRANSACTION_VIEW_ALL,
  ],
  USER: [Permission.TASK_SUBMIT, Permission.TRANSACTION_VIEW_OWN],
};

export const hasPermission = (role: string | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return RolePermissions[role]?.includes(permission) ?? false;
};

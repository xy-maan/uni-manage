type TeamRole = "LEADER" | "MEMBER" | null;
export const teamPermissions = {
  LEADER: {
    canEditTeam: true,
    canDeleteTeam: true,
    canInviteMember: true,
    canKickMember: true,
    canTransferLeadership: true,
    canRequestSupervisor: true,
    canSwitchMethodology: true,
    canCreateTask: true,
    canCreateDeliverable: true,
    canCompleteDeliverable: true,
    canLeaveTeam: true,
  },
  MEMBER: {
    canEditTeam: false,
    canDeleteTeam: false,
    canInviteMember: false,
    canKickMember: false,
    canTransferLeadership: false,
    canRequestSupervisor: false,
    canSwitchMethodology: false,
    canCreateTask: true,
    canCreateDeliverable: true,
    canCompleteDeliverable: true,
    canLeaveTeam: true,
  },
  null: {
    canEditTeam: false,
    canDeleteTeam: false,
    canInviteMember: false,
    canKickMember: false,
    canTransferLeadership: false,
    canRequestSupervisor: false,
    canSwitchMethodology: false,
    canCreateTask: false,
    canCreateDeliverable: false,
    canCompleteDeliverable: false,
    canLeaveTeam: false,
  },
};

export function getTeamPermissions(role: TeamRole) {
  return teamPermissions[role ?? "null"];
}

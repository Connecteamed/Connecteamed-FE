import { useEffect, useMemo, useState } from 'react';

import type { ProjectMember } from '@/types/TaskManagement/project';

import checkedAssignee from '@/assets/icon-selected-orange.svg';
import uncheckedAssignee from '@/assets/icon-unSelectedRoll-orange.svg';

import usePatchTaskAssignees from '@/hooks/TaskPage/Mutate/usePatchTaskAssignees';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';

type Props = {
  projectId: number;
  taskId: string;
  selectedAssigneeIds: number[];
  onClose: () => void;
  onUpdate: (assigneeIds: number[], assigneeNames: string[]) => void;
  disablePatch?: boolean;
};

const AssigneeDropdown = ({
  projectId,
  taskId,
  selectedAssigneeIds,
  onClose: _onClose,
  onUpdate,
  disablePatch = false,
}: Props) => {
  const { data: members = [] } = useGetProjectMemberList(projectId);
  const { mutate: patchAssignees } = usePatchTaskAssignees(projectId);
  const [checkedIds, setCheckedIds] = useState<number[]>(selectedAssigneeIds);

  useEffect(() => {
    setCheckedIds(selectedAssigneeIds);
  }, [selectedAssigneeIds]);

  const memberMap = useMemo(() => {
    return (members as ProjectMember[]).map((m) => ({
      id: m.projectMemberId,
      name: m.memberName,
      roles: Array.isArray(m.roles)
        ? m.roles
            .map((role) =>
              typeof role === 'string'
                ? role
                : typeof role === 'object' && role !== null
                  ? ((role as { roleName?: string }).roleName ?? '')
                  : '',
            )
            .filter(Boolean)
        : [],
    }));
  }, [members]);

  const toggle = (id: number) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      // eslint-disable-next-line no-console
      console.warn('Invalid projectMemberId', { id, numericId, memberMap });
      return;
    }

    const next = checkedIds.includes(numericId)
      ? checkedIds.filter((item) => item !== numericId)
      : [...checkedIds, numericId];
    const names = memberMap.filter((m) => next.includes(m.id)).map((m) => m.name);

    setCheckedIds(next);
    onUpdate(next, names);

    if (!disablePatch) {
      patchAssignees({ taskId, assigneeProjectMemberIds: next });
    }
  };

  return (
    <div className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-white p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]">
      <div className="inline-flex w-28 flex-col items-start justify-start gap-2">
        {memberMap.map((member) => {
          const checked = checkedIds.includes(member.id);

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => toggle(member.id)}
              className="inline-flex items-center justify-start gap-2 self-stretch"
            >
              <div className="flex h-7 w-20 items-center justify-center rounded-[5px] bg-gray-400 px-1.5 py-1">
                <span className="text-sm font-medium text-white">{member.name}</span>
              </div>

              <img
                src={checked ? checkedAssignee : uncheckedAssignee}
                alt={checked ? 'checked' : 'unchecked'}
                className="h-4 w-4"
              />
            </button>
          );
        })}

        {memberMap.length === 0 && <div className="text-xs text-neutral-500">팀원이 없습니다.</div>}
      </div>
    </div>
  );
};

export default AssigneeDropdown;

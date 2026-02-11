import MobileBottomSheet from '@/components/MobileBottomSheet';
import selectedRoll from '@assets/icon-selectedRoll-orange.svg';
import unselectedRoll from '@assets/icon-unSelectedRoll-orange.svg';

type Role = { roleId: number; name: string };

type Props = {
  isOpen: boolean;
  roles?: Role[];
  selectedRoles: string[];
  onToggle: (roleName: string) => void;
  onSave: () => void;
  onClose: () => void;
};

const MobileRoleBottomSheet = ({ isOpen, roles = [], selectedRoles, onToggle, onSave, onClose }: Props) => {
  return (
    <MobileBottomSheet isOpen={isOpen} onClose={onClose} className="w-96 max-w-full gap-6 py-5">
      <div className="flex w-full flex-col items-center gap-6">
        <div className="w-full px-5 text-center text-lg font-medium text-black">역할 선택</div>

        <div className="flex w-full flex-1 flex-col overflow-y-auto">
          {roles.length === 0 && (
            <div className="px-9 py-4 text-center text-sm text-neutral-500">프로젝트 역할이 없어요</div>
          )}
          {roles.map((role, idx) => {
            const isSelected = selectedRoles.includes(role.name);
            const borderTopClass = idx === 0 ? 'border-t' : '';
            return (
              <button
                type="button"
                key={role.roleId}
                className={`flex h-12 w-full items-center border-b border-zinc-200 px-9 py-2 ${borderTopClass}`}
                onClick={() => onToggle(role.name)}
              >
                <div className="inline-flex items-center gap-2">
                  <img
                    src={isSelected ? selectedRoll : unselectedRoll}
                    alt={isSelected ? 'selected role' : 'unselected role'}
                    className="h-4 w-4"
                  />
                  <div className="text-center text-base font-medium text-black">{role.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-72 items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-20 py-1 text-center text-sm font-medium text-white"
          onClick={onSave}
          disabled={!isOpen}
        >
          저장
        </button>
      </div>
    </MobileBottomSheet>
  );
};

export default MobileRoleBottomSheet;

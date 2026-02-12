import { useState, useEffect, useMemo } from 'react';
import type { Notification } from '@/types/notification';
import { instance } from '@/apis';

interface NotificationModalProps {
  unreadCount: number;
  notifications: Notification[];
}

const NotificationModal = ({ unreadCount: initialUnreadCount, notifications: initialNotifications }: NotificationModalProps) => {
  // 로컬 상태 관리
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // 부모 데이터가 갱신되면 로컬 상태도 동기화 (선택 사항)
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // [중요] 화면에 표시할 '읽지 않은 알림' 개수를 현재 상태(notifications) 기준으로 실시간 계산
  // Props로 받은 unreadCount를 쓰지 않고, 현재 리스트에서 읽지 않은 것만 셉니다.
  const displayUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // 알림 삭제 API 요청
  // id 타입을 string -> number로 변경 (서버 응답값에 맞춤)
  const deleteNotification = async (notificationId: number) => {
    try {
      // url에 / 추가하여 절대 경로처럼 동작하게 함 (baseURL 설정에 따라 다를 수 있음)
      await instance.delete(`/notifications/${notificationId}`);
      console.log(`알림 ${notificationId} 삭제 완료`);
    } catch (e) {
      console.error('알림 삭제 실패', e);
    }
  };

  // 알림 클릭 핸들러
  const handleNotificationClick = async (notificationId: number) => {
    // 1. [낙관적 업데이트] UI에서 먼저 삭제 -> displayUnreadCount가 즉시 감소함
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    
    // 2. 서버 요청
    await deleteNotification(notificationId);
  };

  return (
    <div className="flex h-[424px] w-[302px] flex-col rounded-[20px] bg-white px-[26px] py-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      {/* 헤더 영역 */}
      <div className="mb-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-3.5">
          <div className="font-['Roboto'] text-2xl font-bold text-black">알림</div>
          {/* 계산된 displayUnreadCount 사용 */}
          {displayUnreadCount > 0 && (
            <div className="flex h-4 min-w-[16px] items-center justify-center rounded-lg bg-red-500 px-1">
              <span className="text-center font-['Inter'] text-sm font-medium text-white">
                {displayUnreadCount}
              </span>
            </div>
          )}
        </div>
        <div className="h-[1px] w-full bg-gray-200" />
      </div>

      {/* 알림 리스트 영역 */}
      <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="mt-4 text-center text-sm text-neutral-400">알림이 없습니다.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="mb-4 flex flex-col gap-1 border-b border-gray-50 pb-2 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleNotificationClick(n.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="max-w-[140px] truncate font-['Inter'] text-sm font-medium text-black">
                    {n.title}
                  </div>
                  <div className="font-['Roboto'] text-xs font-medium whitespace-nowrap text-neutral-600">
                    {n.createdAt}
                  </div>
                </div>
                <div
                  className={`h-2.5 w-2.5 rounded-full ${n.isRead ? 'bg-gray-300' : 'bg-blue-600'}`}
                />
              </div>
              <div className="font-['Inter'] text-sm leading-tight font-medium break-words text-neutral-600">
                {n.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
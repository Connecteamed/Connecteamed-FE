
import type { Notification } from '@/types/notification';

interface NotificationModalProps {
	unreadCount: number;
	notifications: Notification[];
}

const NotificationModal = ({ unreadCount, notifications }: NotificationModalProps) => {
	return (
		<div className="w-72 h-96 p-4 relative inline-flex justify-end items-start gap-2.5">
			<div className="w-72 h-96 left-0 top-0 absolute bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
				<div className="w-64 h-80 left-[26px] top-[30px] absolute">
					<div className="w-64 left-0 top-0 absolute inline-flex flex-col justify-start items-center gap-4">
						<div className="self-stretch flex flex-col justify-start items-start gap-2.5">
							<div className="self-stretch inline-flex justify-start items-center gap-3.5">
								<div className="w-52 h-7 justify-center text-black text-2xl font-bold font-['Roboto']">알림</div>
								<div className="w-4 h-4 px-1 py-0.5 bg-red-500 rounded-lg inline-flex flex-col justify-center items-center gap-2.5">
									<div className="w-2.5 h-4 text-center justify-center text-white text-sm font-medium font-['Inter']">{unreadCount}</div>
								</div>
							</div>
							<div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-gray-200" />
						</div>
						<div className="self-stretch flex flex-col justify-start items-start gap-2.5">
							{notifications.length === 0 ? (
								<div className="text-neutral-400 text-sm">알림이 없습니다.</div>
							) : (
								notifications.map((n) => (
									<>
										<div key={n.id} className="self-stretch inline-flex justify-between items-center mb-2">
											<div className="flex justify-start items-center gap-1.5">
												<div className="justify-center text-black text-sm font-medium font-['Inter']">{n.title}</div>
												<div className="w-12 h-6 justify-center text-neutral-600 text-xs font-medium font-['Roboto']">{n.createdAt}</div>
											</div>
											<div className={`w-2.5 h-2.5 ${n.isRead ? 'bg-gray-300' : 'bg-blue-600'} rounded-full`} />
										</div>
										<div className="self-stretch h-8 justify-center text-neutral-600 text-sm font-medium font-['Inter']">
											{n.content}
										</div>
									</>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationModal;

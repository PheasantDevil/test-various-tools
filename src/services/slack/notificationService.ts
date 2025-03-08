export interface NotificationSetting {
  channelId: string;
  events: string[]; // 'issue.opened', 'pr.opened', etc.
  repositories: { owner: string; repo: string }[];
}

export const getNotificationSettings = (): NotificationSetting[] => {
  // 実際の実装では API から取得
  return [];
};

export const saveNotificationSetting = async (
  setting: NotificationSetting,
): Promise<void> => {
  // 実際の実装では API に保存
};

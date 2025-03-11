import { slackApiClient } from '../../utils/api';

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

export interface SlackNotification {
  id: string;
  channel: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export const getNotifications = async (): Promise<SlackNotification[]> => {
  try {
    // 実際のAPIがない場合はモックデータを返す
    return [
      {
        id: '1',
        channel: 'C123456',
        text: 'New GitHub issue opened',
        timestamp: '1609459200.000100',
        read: false,
      },
      {
        id: '2',
        channel: 'C123456',
        text: 'PR review requested',
        timestamp: '1609459300.000200',
        read: true,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    // 実際のAPIがない場合は成功を返す
    console.log(`Marking notification ${notificationId} as read`);
    return;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

export const sendNotification = async (
  channelId: string,
  text: string,
): Promise<void> => {
  try {
    await slackApiClient.post('/chat.postMessage', {
      channel: channelId,
      text,
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
};

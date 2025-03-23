import React, { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { Repository } from '../../../services/github/repositoryService';
import {
  CreateChannelParams,
  SlackUser,
  getSlackUsers,
} from '../../../services/slack/channelService';
import './CreateChannelForm.scss';

interface CreateChannelFormProps {
  repositories: Repository[];
  onSubmit: (params: CreateChannelParams) => Promise<void>;
  isLoading?: boolean;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({
  repositories,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<SlackUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const { showToast } = useToast();

  // コンポーネントマウント時にSlackユーザーリストを取得
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const slackUsers = await getSlackUsers();
        if (isMounted) {
          setUsers(slackUsers);
        }
      } catch (error: any) {
        // 429エラー（Too Many Requests）の場合は、エラーログを出力しない
        if (!(error.response && error.response.status === 429)) {
          console.error('Failed to fetch Slack users:', error);
        }
        if (isMounted) {
          // 429エラーの場合は特定のエラーメッセージを表示しない
          if (!(error.response && error.response.status === 429)) {
            showToast('Slackユーザーの取得に失敗しました', 'error');
          }
        }
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();

    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, []); // 空の依存配列で初回のみ実行

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const selectedValues = options.map(option => option.value);
    setSelectedMembers(selectedValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    try {
      await onSubmit({
        repositoryName: selectedRepo,
        description: description || undefined,
        members: selectedMembers.length > 0 ? selectedMembers : undefined,
      });

      // 成功メッセージをトースト通知で表示
      showToast(`チャンネルが正常に作成されました`, 'success');

      // フォームをリセット
      setSelectedRepo('');
      setDescription('');
      setSelectedMembers([]);
    } catch (error) {
      // エラーメッセージをトースト通知で表示
      showToast(
        `チャンネル作成に失敗しました: ${error instanceof Error ? error.message : 'エラーが発生しました'}`,
        'error',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-channel-form">
      <h3>ログチャンネルの作成</h3>
      <div className="form-description">
        <p>
          選択したGitHubリポジトリに対応するSlackチャンネルを作成します。
          チャンネル名は自動的に「log_gh_リポジトリ名」の形式で作成されます。
        </p>
      </div>

      <div className="form-group">
        <label htmlFor="repository">リポジトリ:</label>
        <select
          id="repository"
          value={selectedRepo}
          onChange={e => setSelectedRepo(e.target.value)}
          required
          disabled={isLoading}
        >
          <option value="">選択してください</option>
          {repositories.map(repo => (
            <option key={repo.id} value={repo.name}>
              {repo.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">チャンネルの説明（オプション）:</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="チャンネルの目的や用途を入力してください"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="members">チャンネルメンバー（オプション）:</label>
        <select
          id="members"
          multiple
          value={selectedMembers}
          onChange={handleMemberChange}
          disabled={isLoading || loadingUsers}
          className="members-select"
        >
          {loadingUsers ? (
            <option disabled>ユーザーを読み込み中...</option>
          ) : (
            users.map(user => (
              <option key={user.id} value={user.id}>
                {user.profile.display_name || user.real_name || user.name}
              </option>
            ))
          )}
        </select>
        <small className="help-text">
          Ctrlキー（Macの場合はCommandキー）を押しながらクリックして複数選択できます
        </small>
      </div>

      <button type="submit" disabled={isLoading || !selectedRepo}>
        {isLoading ? '作成中...' : 'チャンネルを作成'}
      </button>
    </form>
  );
};

export default CreateChannelForm;

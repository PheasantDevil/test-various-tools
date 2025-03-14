import React, { useState } from 'react';
import { Repository } from '../../../services/github/repositoryService';
import { CreateChannelParams } from '../../../services/slack/channelService';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    await onSubmit({
      repositoryName: selectedRepo,
      description: description || undefined,
    });
    // フォームをリセット
    setSelectedRepo('');
    setDescription('');
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

      <button type="submit" disabled={isLoading || !selectedRepo}>
        {isLoading ? '作成中...' : 'チャンネルを作成'}
      </button>
    </form>
  );
};

export default CreateChannelForm;

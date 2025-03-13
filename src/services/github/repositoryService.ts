import { githubApiClient } from '../../utils/api';

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
}

export const getRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await githubApiClient.get('/user/repos', {
      params: {
        sort: 'updated',
        direction: 'desc',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    throw error;
  }
};

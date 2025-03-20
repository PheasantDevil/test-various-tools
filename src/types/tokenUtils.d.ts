declare module '../../utils/tokenUtils' {
  export function getGitHubToken(): string | null;
  export function getSlackToken(): string | null;
  export function setGitHubToken(token: string): void;
  export function setSlackToken(token: string): void;
  export function clearTokens(): void;
}

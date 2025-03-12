import React, { lazy, Suspense } from 'react';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.scss';
import LoadingSpinner from './components/atoms/LoadingSpinner';
import { GitHubProvider } from './contexts/GitHubContext';
import { SlackProvider } from './contexts/SlackContext';
import TokenCheck from './pages/TokenCheck';

// アクティブなリンクを判定するためのコンポーネント
const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  );
};

// NavBar コンポーネント
const NavBar = () => {
  return (
    <nav className="app-nav">
      <ul>
        <li>
          <NavLink to="/">GitHub 管理</NavLink>
        </li>
        <li>
          <NavLink to="/slack">Slack 管理</NavLink>
        </li>
        <li>
          <NavLink to="/token-check">トークン確認</NavLink>
        </li>
      </ul>
    </nav>
  );
};

// 遅延ローディング
const GitHubPage = lazy(() => import('./pages/github/GitHubPage'));
const SlackPage = lazy(() => import('./pages/slack/SlackPage'));

function App() {
  return (
    <div className="App">
      <GitHubProvider>
        <SlackProvider>
          <Router>
            <NavBar />

            <main className="app-content">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<GitHubPage />} />
                  <Route path="/slack" element={<SlackPage />} />
                  <Route path="/token-check" element={<TokenCheck />} />
                </Routes>
              </Suspense>
            </main>
          </Router>
        </SlackProvider>
      </GitHubProvider>
    </div>
  );
}

export default App;

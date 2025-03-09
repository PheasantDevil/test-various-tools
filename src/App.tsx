import React from 'react';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.scss';
import { GitHubProvider } from './contexts/GitHubContext';
import { SlackProvider } from './contexts/SlackContext';
import GitHubPage from './pages/github/GitHubPage';
import SlackPage from './pages/slack/SlackPage';

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
      </ul>
    </nav>
  );
};

function App() {
  return (
    <div className="App">
      <GitHubProvider>
        <SlackProvider>
          <Router>
            <NavBar />

            <main className="app-content">
              <Routes>
                <Route path="/" element={<GitHubPage />} />
                <Route path="/slack" element={<SlackPage />} />
              </Routes>
            </main>
          </Router>
        </SlackProvider>
      </GitHubProvider>
    </div>
  );
}

export default App;

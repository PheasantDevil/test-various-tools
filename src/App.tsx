import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import { GitHubProvider } from './contexts/GitHubContext';
import { SlackProvider } from './contexts/SlackContext';
import GitHubPage from './pages/github/GitHubPage';
import SlackPage from './pages/slack/SlackPage';

function App() {
  return (
    <div className="App">
      <GitHubProvider>
        <SlackProvider>
          <Router>
            <nav className="app-nav">
              <ul>
                <li>
                  <Link to="/">GitHub 管理</Link>
                </li>
                <li>
                  <Link to="/slack">Slack 管理</Link>
                </li>
              </ul>
            </nav>

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

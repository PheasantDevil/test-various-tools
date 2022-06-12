import React from 'react';
import './ReactApp.scss';
import logo from './logo.svg';

class ReactApp extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </>
    );
  }
}

export default ReactApp;

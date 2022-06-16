import React from 'react';
import './App.scss';
// import ReactApp from './components/molucules/ReactApp/ReactApp';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChoreTimeTree from './components/organisms/ChoreTimeTree';
import Home from './components/organisms/Home';

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter> */}
      {/* <div className="App">
          <CommonFrame viewComponent={<IdInfo />} componentName="idInfo" />
        </div> */}
      <h1>各ページへのリンクはこちら</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/timetree">chore TimeTree</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      {route()}
      {/* </BrowserRouter> */}
    </div>
  );

  function route() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timetree" element={<ChoreTimeTree />} />
        <Route path="/about" element={<h2>about</h2>} />
        <Route path="/contact" element={<h2>contact</h2>} />
        <Route path="*" element={<h2>page not found</h2>} />
      </Routes>
    );
  }
}

export default App;

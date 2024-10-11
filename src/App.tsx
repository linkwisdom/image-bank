import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ImageCollection from './pages/ImageCollection';
import ImageSearch from './pages/ImageSearch';
import ImageEditor from './pages/ImageEditor';
import UserProfile from './pages/UserProfile';
import PresentationCreator from './pages/PresentationCreator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/collection" element={<ImageCollection />} />
              <Route path="/search" element={<ImageSearch />} />
              <Route path="/editor" element={<ImageEditor />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/presentation" element={<PresentationCreator />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
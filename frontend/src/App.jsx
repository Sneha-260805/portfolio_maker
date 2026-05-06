import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Editor from './pages/Editor.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* /editor — create new portfolio */}
        <Route path="/editor" element={<Editor />} />
        {/* /editor/:slug — load and edit existing portfolio */}
        <Route path="/editor/:slug" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

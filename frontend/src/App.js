import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReqForm from "./pages/ReqForm";
import Curriculum from "./pages/Curriculum";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/reqForm" element={<ReqForm />} />
          <Route path="/curriculum" element={<Curriculum />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

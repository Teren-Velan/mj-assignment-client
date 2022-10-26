import { Routes, Route } from "react-router-dom";
import { Login, Dashboard, Logout } from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;

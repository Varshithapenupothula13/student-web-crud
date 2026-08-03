import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
  <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>

   <ToastContainer
  position="top-center"
  autoClose={2000}
  hideProgressBar={true}
  newestOnTop
  closeOnClick
  pauseOnHover
/>
  </>

  );
}

export default App;
import './App.css'
import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/homepage/Homepage.jsx";
import Register from "./pages/register/Register.jsx";

function App() {

  return (
      <div>
          <Routes>
              <Route path="/" element={<Homepage/>} />
              <Route path="/register" element={<Register/>} />
          </Routes>
      </div>
  )
}

export default App

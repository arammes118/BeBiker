import './App.css';

import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from "react-router-dom";

//componentes
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

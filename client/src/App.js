import './App.css';

import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from "react-router-dom";

//componentes
import Login from "./components/Login";
import Home from './components/Home';
import Registro from './components/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='registro' element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

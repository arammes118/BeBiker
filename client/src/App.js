import {
	BrowserRouter,
	Routes,
	Route,
	Navigate
} from "react-router-dom";

//componentes
import Login from "./components/Login";
import Registro from './components/Registro';
import { ResetPass } from "./components/ResetPass";
import { Publicaciones } from "./components/Publicaciones";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Navigate to="/login" /> } />
        <Route path="/login" element={<Login />} />
        <Route path='/registro' element={<Registro />} />
        <Route path='/resetpass' element={<ResetPass />} />
        
        <Route path="/publicaciones" element={<Publicaciones />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

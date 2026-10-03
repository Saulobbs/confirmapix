import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Assinatura from "./pages/Assinatura";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { Recursos, Integracoes, Precos, ApiDocs, Contato } from "./pages/InfoPages";
import Demonstracao from "./pages/Demonstracao";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
           path="/admin"
          element={<Admin />}
        />

        <Route
          path="/assinatura"
          element={<Assinatura />}
        />

        <Route path="/recursos" element={<Recursos />} />
        <Route path="/integracao" element={<Integracoes />} />
        <Route path="/precos" element={<Precos />} />
        <Route path="/api" element={<ApiDocs />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/demonstracao" element={<Demonstracao />} />

      </Routes>

    </BrowserRouter>

  );

}

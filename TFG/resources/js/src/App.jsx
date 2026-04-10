import { Suspense, lazy } from "react";
import "./INDEX/index.css";
import "./ROUTE/routes.css";
import "./TIENDA/tienda.css";
import "./TICKETS/tickets.css";
import "./USUARIO/usuario.css";
import { Route, Routes } from "react-router-dom";
import LoginModal from "./Components/Modal/LoginModal";
import RegisterModal from "./Components/Modal/RegisterModal";
import AdminPanel from "./ADMIN/Components/AdminPanel";
import CartToast from "./Components/Modal/CartToast";
import GlobalProvider from "./Providers/GlobalProviders";

const Index = lazy(() => import("./INDEX/Components/Index"));
const RoutesH = lazy(() => import("./ROUTE/Components/RoutesH"));
const Tickets = lazy(() => import("./TICKETS/Components/Tickets"));
const Tienda = lazy(() => import("./TIENDA/Components/Tienda"));
const Usuario = lazy(() => import("./USUARIO/Components/Usuario"));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <GlobalProvider>
        <CartToast />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Routes" element={<RoutesH />} />
          <Route path="/Tickets" element={<Tickets />} />
          <Route path="/Tienda" element={<Tienda />} />
          <Route path="/LoginModal" element={<LoginModal />} />
          <Route path="/Register" element={<RegisterModal />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/usuario" element={<Usuario />} />
        </Routes>
      </GlobalProvider>
    </Suspense>
  );
}

export default App;

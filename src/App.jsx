import "./styles/global.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./Layouts/dasboard-layout";
import DashboardPage from "./Pages/Dashboard/Dashboard";
import ClientsPage from "./Pages/Clients/GestionClientes";
import AccountsPage from "./Pages/Cuentas/AccountPage";
import PaymentsPage from "./Pages/pagos/PaymentPage";
import Profile from "./components/Profile";
import CalendarPage from "./Pages/Calendar/CalendarPage";


export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/Dashboard" />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/Gestion-clientes" element={<ClientsPage />} />
        <Route path="/Gestion-cuentas" element={<AccountsPage />} />
        <Route path="/Gestion-pagos" element={<PaymentsPage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Calendar" element={<CalendarPage />} />
      </Route>
    </Routes>
  );
}
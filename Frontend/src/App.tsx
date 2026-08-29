import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Impact from "@/pages/Impact";
import Matching from "@/pages/Matching";
import Rescue from "@/pages/Rescue";
import Surplus from "@/pages/Surplus";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/surplus" element={<Surplus />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/rescue" element={<Rescue />} />
        <Route path="/impact" element={<Impact />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

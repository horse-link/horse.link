import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Routing from "./Routing";
import { Suspense } from "react";
import Transition from "./pages/Transition";

const Navigation: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<Transition />}>
      <Routes>
        {Routing.map(({ path, element, props }) => (
          <Route path={path} element={element} {...props} key={path} />
        ))}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Navigation;

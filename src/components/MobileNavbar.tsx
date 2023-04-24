import React from "react";
import { Link } from "react-router-dom";

export const MobileNavbar: React.FC = () => (
  <div className="w-full bg-hl-background-secondary py-3 px-4 font-basement text-xl tracking-wider text-hl-secondary">
    <Link to="/">
      HORSE<span className="text-hl-primary">LINK</span>
    </Link>
  </div>
);

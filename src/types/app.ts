import { ReactNode } from "react";
import { RouteProps } from "react-router-dom";

export type AppPath = `/${string}`;

export type AppRoute = {
  path: AppPath;
  element: ReactNode;
  props?: RouteProps;
};

export type AppRoutes = AppRoute[];

export type NavbarRoute = Pick<AppRoute, "path"> & {
  name: string;
};

export type NavbarRoutes = NavbarRoute[];

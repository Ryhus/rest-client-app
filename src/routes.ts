import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    file: './layouts/MainLayout/MainLayout.tsx',
    children: [{ index: true, file: './pages/Home/Home.tsx' }],
  },
] satisfies RouteConfig;

import { type RouteConfig } from '@react-router/dev/routes';

export default [
  {
    path: '/',
    file: './layouts/MainLayout/MainLayout.tsx',
    children: [
      {
        index: true,
        file: './pages/Home/Home.tsx',
      },
      {
        path: 'signup',
        file: './pages/SignUp/SignUp.tsx',
      },
      { path: 'login', file: './pages/SignIn/SignIn.tsx' },
      {
        path: '/rest-client/:method?/:encodedUrl?/:encodedBody?',
        file: './pages/RestClient/RestClient.tsx',
      },
    ],
  },
] satisfies RouteConfig;

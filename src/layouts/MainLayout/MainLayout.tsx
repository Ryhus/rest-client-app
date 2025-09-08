import { Outlet } from 'react-router-dom';

import { Footer, Header } from '@/components';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

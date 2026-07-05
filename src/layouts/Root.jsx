import { Suspense } from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

const Root = () => {
  return (
    <div>
      <header className="sticky top-0 z-1000 bg-white shadow-sm">
        <NavBar></NavBar>
      </header>

      <main>
        <Suspense fallback={<Loading></Loading>}>
          <Outlet></Outlet>
        </Suspense>
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default Root;

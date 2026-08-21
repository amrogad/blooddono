import { Suspense } from 'react';
import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import AssistantBubble from '../components/AssistantBubble';

const Root = () => {
  return (
    <div>
      <header className="sticky top-0 z-1000 border-b border-line bg-card/90 backdrop-blur-md">
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

      <AssistantBubble></AssistantBubble>
    </div>
  );
};

export default Root;

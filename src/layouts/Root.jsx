import { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router';
import NavBar from '../pages/shared/NavBar';
import Footer from '../pages/shared/Footer';
import Loading from '../pages/shared/Loading';
import useAuthBootstrap from '../hooks/useAuthBootstrap';


const Root = () => {

    const { state } = useNavigation();
    useAuthBootstrap();

    return (
        <div>
            <header className='sticky top-0 z-1000 bg-white'>
                <NavBar></NavBar>
            </header>

            <main>
                {state == "loading" ? <Loading></Loading> : <Suspense fallback={<Loading></Loading>}><Outlet></Outlet></Suspense>}
            </main>

            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default Root;
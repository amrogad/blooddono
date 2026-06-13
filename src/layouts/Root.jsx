import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import NavBar from '../pages/shared/NavBar';
import Footer from '../pages/shared/Footer';
import Loading from '../pages/shared/Loading';


const Root = () => {

    const { state } = useNavigation();

    return (
        <div>
            <header className='sticky top-0 z-1000 bg-white'>
                <NavBar></NavBar>
            </header>

            <main>
                {state == "loading" ? <Loading></Loading> : <Outlet></Outlet>}
            </main>

            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default Root;
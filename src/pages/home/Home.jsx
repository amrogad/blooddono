import React from 'react';
import Hero from './Hero';
import Features from './Features';
import ContactUs from './ContactUs';
import PopularPages from './PopularPages';
import LatestBlog from './LatestBlog';
import Faqs from './Faqs';
import BeADonor from './BeADonor';
import AverageUsers from './AverageUsers';

const Home = () => {

    // const products = useLoaderData();

    return (
        <div className='max-w-[1600px] mx-auto px-4 py-2 lg:py-8'>

            <Hero></Hero>
            <BeADonor></BeADonor>
            <Features></Features>
            <PopularPages></PopularPages>
            <AverageUsers></AverageUsers>
            <LatestBlog></LatestBlog>
            <Faqs></Faqs>
            <ContactUs></ContactUs>
            
        </div>
    );
};

export default Home;
import { createBrowserRouter } from "react-router";
import Root from "../layouts/Root";
import Home from "../pages/home/Home";
import ErrorPage from "../pages/shared/ErrorPage";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../provider/PrivateRoute";
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import CreateDonationRequest from "../pages/Dashboard/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/MyDonationRequests";
import DonationRequestDetails from "../pages/Dashboard/DonationRequestDetails";
import EditDonationRequest from "../pages/Dashboard/EditDonationRequest";
import Forbidden from "../pages/shared/Forbidden";
import AdminRoute from "../provider/AdminRoute";
import AllUsersPage from "../pages/Dashboard/AllUsersPage";
import AllBloodDonationPage from "../pages/Dashboard/AllBloodDonationPage";
import AdminEditDonationRequest from "../pages/Dashboard/AdminEditDonationRequest";
import MultiRoleRoute from "../provider/MultiRoleRoute";
import SearchPage from "../pages/Search/SearchPage";
import BloodDonationRequest from "../pages/BloodDonationRequest/BloodDonationRequest";
import HomeDonationRequestDetails from "../pages/HomeDonationRequestDetails/HomeDonationRequestDetails";
import AddBlogPage from "../pages/Dashboard/AddBlogPage";
import BlogDetails from "../pages/Dashboard/BlogDetails";
import ContentManagementPage from "../pages/Dashboard/ContentManagementPage";
import EditBlogPage from "../pages/Dashboard/EditBlogPage";
import PublicBlogList from "../pages/Blogs/PublicBlogList";
import PublicBlogDetails from "../pages/Blogs/PublicBlogDetails";
import FundingPage from "../pages/FundingPage/FundingPage";
import Payment from "../pages/FundingPage/Payment";
import AboutUs from "../pages/AboutUs/AboutUs";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                path: '/',
                element: <Home></Home>,
            },
            {
                path: 'search',
                element: <SearchPage></SearchPage>,
            },
            {
                path: 'blood-donation-request',
                element: <BloodDonationRequest></BloodDonationRequest>,
            },
            {
                path: 'home-donation-request-details/:id',
                element: <PrivateRoute><HomeDonationRequestDetails></HomeDonationRequestDetails></PrivateRoute>,
            },
            {
                path: 'blogs',
                element: <PublicBlogList></PublicBlogList>,
            },
            {
                path: 'blogs/:id',
                element: <PublicBlogDetails></PublicBlogDetails>,
            },
            {
                path: 'funds',
                element: <PrivateRoute><FundingPage></FundingPage></PrivateRoute>,
            },
            {
                path: 'funds/payment',
                element: <PrivateRoute><Payment></Payment></PrivateRoute>,
            },
            {
                path:'/aboutUs',
                element: <AboutUs></AboutUs>,
            },
            {
                path: "login",
                element: <Login></Login>,
            },
            {
                path: "register",
                element: <Register></Register>,
            },
            {
                path: 'forbidden',
                element: <Forbidden></Forbidden>,
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                element: <DashboardHome></DashboardHome>,
            },
            {
                path: 'profile',
                element: <Profile></Profile>,
            },
            {
                path: 'my-donation-requests',
                element: <MultiRoleRoute allowedRoles={['admin', 'donor']}><MyDonationRequests></MyDonationRequests></MultiRoleRoute>,
            },
            {
                path:'create-donation-request',
                element: <MultiRoleRoute allowedRoles={['admin', 'donor']}><CreateDonationRequest></CreateDonationRequest></MultiRoleRoute>,
            },
            {
                path: 'donation-details/:id',
                element: <MultiRoleRoute allowedRoles={['admin', 'donor']}><DonationRequestDetails></DonationRequestDetails></MultiRoleRoute>,
            },
            {
                path: 'edit-donation-request/:id',
                element: <MultiRoleRoute allowedRoles={['admin', 'donor']}><EditDonationRequest></EditDonationRequest></MultiRoleRoute>,
            },
            {
                path: 'all-users',
                element: <AdminRoute><AllUsersPage></AllUsersPage></AdminRoute>,
            },
            {
                path: 'all-blood-donation-request',
                element: <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
                    <AllBloodDonationPage></AllBloodDonationPage>
                </MultiRoleRoute>,
            },
            {
                path: 'admin-edit-donation/:id',
                element: <AdminRoute><AdminEditDonationRequest></AdminEditDonationRequest></AdminRoute>,
            },
            {
                path: 'content-management-page',
                element: <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
                    <ContentManagementPage></ContentManagementPage>
                </MultiRoleRoute>,
            },
            {
                path:'content-management-page/add-blogs',
                element: <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
                    <AddBlogPage></AddBlogPage>
                </MultiRoleRoute>,
            },
            {
                path: 'content-management-page/blogs/:id',
                element: <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
                    <BlogDetails></BlogDetails>
                </MultiRoleRoute>,
            },
            {
                path:'content-management-page/edit-blog/:id',
                element: <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
                    <EditBlogPage></EditBlogPage>
                </MultiRoleRoute>,
            },  
        ]
    },
    // {
    //     path:"/*",
    //     element: <Error></Error>,
    // },
]);

export default router;
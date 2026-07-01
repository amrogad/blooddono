import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import Root from './layouts/Root';
import Home from './pages/home/Home';
import ErrorPage from './components/ErrorPage';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './auth/PrivateRoute';
const Profile = lazy(() => import('./pages/Dashboard/Profile'));
const DashboardHome = lazy(() => import('./pages/Dashboard/DashboardHome'));
const CreateDonationRequest = lazy(() => import('./pages/Dashboard/donations/CreateDonationRequest'));
const MyDonationRequests = lazy(() => import('./pages/Dashboard/donations/MyDonationRequests'));
const DonationRequestDetails = lazy(() => import('./pages/Dashboard/donations/DonationRequestDetails'));
const EditDonationRequest = lazy(() => import('./pages/Dashboard/donations/EditDonationRequest'));
import Forbidden from './components/Forbidden';
import AdminRoute from './auth/AdminRoute';
const AllUsersPage = lazy(() => import('./pages/Dashboard/AllUsersPage'));
const AllBloodDonationPage = lazy(() => import('./pages/Dashboard/donations/AllBloodDonationPage'));
const AdminEditDonationRequest = lazy(() => import('./pages/Dashboard/donations/AdminEditDonationRequest'));
import MultiRoleRoute from './auth/MultiRoleRoute';
const SearchPage = lazy(() => import('./pages/Search/SearchPage'));
const BloodDonationRequest = lazy(
  () => import('./pages/BloodDonationRequest/BloodDonationRequest'),
);
const HomeDonationRequestDetails = lazy(
  () => import('./pages/HomeDonationRequestDetails/HomeDonationRequestDetails'),
);
const AddBlogPage = lazy(() => import('./pages/Dashboard/content/AddBlogPage'));
const BlogDetails = lazy(() => import('./pages/Dashboard/content/BlogDetails'));
const ContentManagementPage = lazy(() => import('./pages/Dashboard/content/ContentManagementPage'));
const EditBlogPage = lazy(() => import('./pages/Dashboard/content/EditBlogPage'));
const PublicBlogList = lazy(() => import('./pages/Blogs/PublicBlogList'));
const PublicBlogDetails = lazy(() => import('./pages/Blogs/PublicBlogDetails'));
const FundingPage = lazy(() => import('./pages/FundingPage/FundingPage'));
const Payment = lazy(() => import('./pages/FundingPage/Payment'));
const AboutUs = lazy(() => import('./pages/AboutUs/AboutUs'));

const router = createBrowserRouter([
  {
    path: '/',
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
        element: (
          <PrivateRoute>
            <HomeDonationRequestDetails></HomeDonationRequestDetails>
          </PrivateRoute>
        ),
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
        element: (
          <PrivateRoute>
            <FundingPage></FundingPage>
          </PrivateRoute>
        ),
      },
      {
        path: 'funds/payment',
        element: (
          <PrivateRoute>
            <Payment></Payment>
          </PrivateRoute>
        ),
      },
      {
        path: 'about-us',
        element: <AboutUs></AboutUs>,
      },
      {
        path: 'login',
        element: <Login></Login>,
      },
      {
        path: 'register',
        element: <Register></Register>,
      },
      {
        path: 'forbidden',
        element: <Forbidden></Forbidden>,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
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
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'donor']}>
            <MyDonationRequests></MyDonationRequests>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'create-donation-request',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'donor']}>
            <CreateDonationRequest></CreateDonationRequest>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'donation-details/:id',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'donor']}>
            <DonationRequestDetails></DonationRequestDetails>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'edit-donation-request/:id',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'donor']}>
            <EditDonationRequest></EditDonationRequest>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'all-users',
        element: (
          <AdminRoute>
            <AllUsersPage></AllUsersPage>
          </AdminRoute>
        ),
      },
      {
        path: 'all-blood-donation-request',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
            <AllBloodDonationPage></AllBloodDonationPage>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'admin-edit-donation/:id',
        element: (
          <AdminRoute>
            <AdminEditDonationRequest></AdminEditDonationRequest>
          </AdminRoute>
        ),
      },
      {
        path: 'content-management-page',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
            <ContentManagementPage></ContentManagementPage>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'content-management-page/add-blogs',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
            <AddBlogPage></AddBlogPage>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'content-management-page/blogs/:id',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
            <BlogDetails></BlogDetails>
          </MultiRoleRoute>
        ),
      },
      {
        path: 'content-management-page/edit-blog/:id',
        element: (
          <MultiRoleRoute allowedRoles={['admin', 'volunteer']}>
            <EditBlogPage></EditBlogPage>
          </MultiRoleRoute>
        ),
      },
    ],
  },
]);

export default router;

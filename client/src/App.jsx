import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingError from './components/RoutingError';
import RootLayout from "./RootLayout";import { useState } from 'react'
import Home from './components/home/Home';
import SignupSeeker from './components/signupseeker/SignUpSeeker'
import SignUpProviders from './components/signupproviders/SignUpProviders';
import SeekerLogin from './components/seekerlogin/SeekerLogin';
import ProviderLogin from './components/providerlogin/ProviderLogin';
import Electrical from './components/electrical/Electrical';
import Plumbing from './components/plumbing/Plumbing';
import Cleaning from './components/cleaning/Cleaning';
import Repair from './components/repair/Repair';
import Painting from './components/painting/Painting';
import Shifting from './components/shifting/Shifting';
import Booking from './components/booking/Booking';
import SeekerProfile from './components/seekerprof/SeekerProfile';
import ProviderDashboard from './components/providerdashboard/ProviderDashboard';
import ResetPassword from './components/resetpassword/ResetPassword';

function App() {
  const browserRouter =createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      errorElement: <RoutingError />,
      children: [
        {
          path:'',
          element:<Home />
         },
         {
          path:'/signupseeker',
          element:<SignupSeeker />
         },
         {
          path:'/signupproviders',
          element:<SignUpProviders />
         },
         {
          path:'/seekerlogin',
          element:<SeekerLogin />
         },
         {
          path:'/providerlogin',
          element:<ProviderLogin />
         },
         {
          path:'/services/Plumbing',
          element:<Plumbing />
         },
         {
          path:'/services/Electrical',
          element:<Electrical />
         },
         {
          path:'/services/Cleaning',
          element:<Cleaning />
         },
         {
          path:'/services/Repair',
          element:<Repair />
         },
         {
          path:'/services/Painting',
          element:<Painting />
         },
         {
          path:'/services/Shifting',
          element:<Shifting />
         },
         {
          path:'/booking',
          element:<Booking />
         },
         {
          path:'/seeker-profile',
          element:<SeekerProfile />
         },
         {
          path:'/provider-dashboard',
          element:<ProviderDashboard />
         },
         {
          path:'/reset-password',
          element:<ResetPassword />
         }

      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={browserRouter} />
      
    </div>
  )
}

export default App

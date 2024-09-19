import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import Logout from './Logout';
import Loading from './components/Loading';
import AuthSuccess from './AuthSuccess';

const Landing = lazy(() => import('./components/landing/landing'));
const Register = lazy(() => import('./components/register/Register'));
const ForgetPassword = lazy(() => import('./components/login/ForgetPassword'));
const Login = lazy(() => import('./components/login/Login'));
const ForgetPasswordConfirm = lazy(() => import('./components/login/ForgetPasswordConfirm'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const UserProfile_New = lazy(() => import('./components/profile/UserProfile_New'));
const Profile = lazy(() => import('./components/profile/Profile'));
const Dashboard = lazy(() => import('./components/dashboard/Main'));
const Expert = lazy(() => import('./components/dashboard/Expert'));
const QuickHit = lazy(() => import('./components/profile/Credits/QuickHit'));
const Songcritique = lazy(() => import('./components/profile/Credits/Songcritique'));
const Sessions = lazy(() => import('./components/profile/Sessions/Sessions'));
const Cart = lazy(() => import('./components/cart/Cart'));
const HelpSupport = lazy(() => import('./components/HelpSupport'));
const Inbox = lazy(() => import('./components/Inbox/Inbox'));
const FieldsForgetPasssword = React.lazy(() => import('./components/login/FieldsForgetPassword'));
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import Privacy from './components/landing/Privacy';
import Deletion from './components/landing/Deletion';
const Cancel = React.lazy(() => import('./components/Cancel'));

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const userData = cookies.user;
  const fieldsCompleteStatus = userData ? userData.fieldsCompeleteStatus : null;

  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Landing />} />
            <Route path='/privacypolicy' element={<Privacy />} />
            <Route path='/deletionpolicy' element={<Deletion />} />
            <Route path='/signup' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/getverify/:token' element={<FieldsForgetPasssword />} />
            <Route path='/forgetpassword' element={<ForgetPassword />} />
            <Route path='/forgetpasswordconfirm' element={<ForgetPasswordConfirm />} />
            <Route path='/callback' element={<AuthSuccess />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route path='/profile/:name/new' element={<UserProfile_New />} />
            <Route path='/profile/:name' element={<UserProfile />} />

            <Route path='/cancel' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Cancel />} />

            <Route path='/profile' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/onboardingprofile' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/favorites' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/credits' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/changepassword' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/notifications' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Profile />} />
            <Route path='/help' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <HelpSupport />} />
            <Route path='/inbox' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Inbox />} />
            <Route path='/credits/quickhit' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <QuickHit />} />
            <Route path='/credits/songcritique' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Songcritique />} />
            <Route path='/sessions' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Sessions />} />
            <Route path='/expert' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Dashboard />} />
            <Route path='/expert/:id' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Expert />} />
            <Route path='/cart' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}/new`} replace /> : <Cart />} />
            {/* <Route path='/addcards' element={fieldsCompleteStatus === false ? <Navigate to={`/profile/${userData.id}`} replace /> : <Profile />} /> */}

            <Route path='/logout' element={<Logout />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Login from "./pages/Login/Login.js";
import SignUp from "./pages/Login/SignUp.js";
import ProtectedRoute from "./pages/ProtectedRoute.js";
import PageLoading from "./pages/PageLoading.js";
import Feed from "./pages/Feed/Feed.js";
import Explore from "./pages/Explore/Explore.js";
import Notifications from "./pages/Notifications/Notifications.js";
import Messages from "./pages/Messages/Messages.js";
import Bookmarks from "./pages/Bookmarks/Bookmarks.js";
import Lists from "./pages/Lists/Lists.js";
import Profile from "./pages/Profile/Profile.js";
import More from "./pages/More/More.js";
import Subscribe from "./pages/Subscribe/Subscribe.js";
import Payment from "./pages/Payment/Payment.js";
import Payment1 from "./pages/Payment/Payment1.js";
import StripePay from "./pages/Payment/StripePay.js";
import Premium from "./pages/PremiumVerification/Premium.js";
import StripePay2 from "./pages/Payment/StripePay2.js";
import AdminLogin from "./pages/Login/AdminLogin.js";
import AdminDashboard from "./AdminDashboard/AdminDashboard.js";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute.js";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
          </Route>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="lists" element={<Lists />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
            <Route path="subscribe" element={<Subscribe />} />
            <Route path="premium" element={<Premium />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/page-loading" element={<PageLoading />} />
          <Route path="/payment/:subscriptionType" element={<StripePay />} />
          <Route path="/premPay" element={<StripePay2 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

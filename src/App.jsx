import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./Components/PrivateRoute";
import './App.css';

// Common components
import Nav from "./Components/Nav/Nav";
import LandingPage from './Components/LandingPage/LandingPage';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./Pages/Dashboard/DashboardPage'));
const Product = lazy(() => import('./Pages/Products/Products'));
const Bids = lazy(() => import('./Pages/Bids/Bid'));
const Enquiry = lazy(() => import('./Pages/Enquiry/Enquiry'));
const Orders = lazy(() => import('./Pages/Orders/Orders'));
const Review = lazy(() => import('./Pages/Review/Review'));
const Brochures = lazy(() => import('./Pages/Brochures/Brochures'));
const Media = lazy(() => import('./Pages/Media/Media'));
const Location = lazy(() => import('./Pages/LocationDirectory/Location'));
const Blog = lazy(() => import('./Pages/Blog/Blog'));
const Portfolio = lazy(() => import('./Pages/Portfolio/Portfolio'))

// Add pages
const AddProduct = lazy(() => import('./Pages/AddProduct/AddProduct'));
const AddReview = lazy(() => import('./Pages/AddReview/AddReview'));
const AddMedia = lazy(() => import('./Pages/AddMedia/AddMedia'));
const AddLocation = lazy(() => import('./Pages/AddLocation/AddLocations'));
const AddBrochures = lazy(() => import('./Pages/AddBrochures/AddBrochures'));
const AddAchievment = lazy(() => import('./Pages/AddAchievment/AddAchievment'));
const AddPortfolio = lazy(() => import('./Pages/AddPortfolio/AddPortfolio'));
const AddLocationDirectory = lazy(() => import('./Pages/AddLocationDirectory/LocationDirectory'))

// View Brands
const ViewBrands = lazy(() => import('./Pages/AddBrands/ViewBrands'))
const AddBrands = lazy(() => import('./Pages/AddBrands/AddBrands'))


// Edit pages
const EditProduct = lazy(() => import('./Pages/EditProduct/EditProduct'));
const EditReview = lazy(() => import('./Pages/EditReviews/EditR'));
const EditLocation = lazy(() => import('./Pages/EditLocation/EditL'));
const EditBrochure = lazy(() => import('./Pages/EditBrochures/EditB'));
const EditMedia = lazy(() => import('./Pages/EditMedia/EditMedia'))
const EditPortfolio = lazy(() => import('./Pages/EditPortfolio/EditPortfolio'))

// Authentication
const Signup = lazy(() => import('./Pages/SignUp/Signup'));
const Login = lazy(() => import('./Pages/LoginSignup/LoginSignupForm'));
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword/ForgotPassword'));

// Optional pop-up or shared edit components
const ReviewCard = lazy(() => import('./Components/PopUp/EditReview'));

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="products" element={<Product />} />
      <Route path="bids" element={<Bids />} />
      <Route path="enquiry" element={<Enquiry />} />
      <Route path="orders" element={<Orders />} />
      <Route path="review" element={<Review />} />
      <Route path="brochures" element={<Brochures />} />
      <Route path="media" element={<Media />} />
      <Route path="location" element={<Location />} />
      <Route path="blogs" element={<Blog />} />
      <Route path="portfolio" element={<Portfolio />} />

      {/* Add Pages */}
      <Route path="product/addProduct" element={<AddProduct />} />
      <Route path="review/addReview" element={<AddReview />} />
      <Route path="media/addMedia" element={<AddMedia />} />
      <Route path="location/addLocation" element={<AddLocation />} />
      <Route path="location/addLocationDirectory" element={<AddLocationDirectory />} />
      <Route path="addBrochures" element={<AddBrochures />} />
      <Route path="dashboard/addAchievment" element={<AddAchievment />} />
      <Route path="dashboard/viewBrands" element={<ViewBrands />} />
      <Route path="portfolio/addPortfolio" element={<AddPortfolio />} />
      <Route path="dashboard/viewBrands/addBrand" element={<AddBrands />} />

      {/* Edit Pages */}
      <Route path="update-review/:id" element={<EditReview />} />
      <Route path="location/edit-location/:id" element={<EditLocation />} />
      <Route path="brochures/edit/:id" element={<EditBrochure />} />
      <Route path="media/edit-media/:id" element={<EditMedia />} />
      <Route path="portfolio/edit-portfolio/:id" element={<EditPortfolio />} />
      <Route path="dashboard/viewBrands/:id?" element={<ViewBrands />} />
      <Route path="edit/:id" element={<EditProduct />} />

      {/* Shared/Popup Component */}
      <Route path="popup/review" element={<ReviewCard />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Nav />

        <div className="ml-14 lg:ml-36 flex-1 overflow-x-hidden">
          <Suspense fallback={<div className="text-center mt-10">Lazy Loading...</div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<LandingPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute>
                    <AdminRoutes />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;

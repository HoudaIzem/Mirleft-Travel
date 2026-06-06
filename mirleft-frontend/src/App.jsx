import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";

// Improved pages (new versions) with pagination
import PropertiesList from "./pages/PropertiesList-Improved";
import PropertyDetails from "./pages/PropertyDetails-Improved";
import RestaurantsList from "./pages/RestaurantsList";
import RestaurantDetails from "./pages/RestaurantDetails";
import ActivitiesList from "./pages/ActivitiesList";
import ActivityDetails from "./pages/ActivityDetails";
import Contact from "./pages/Contact-Improved";
import UserProfile from "./pages/UserProfile";
import SearchResults from "./pages/SearchResults";
import AdminDashboard from "./pages/AdminDashboard";
import DestinationsList from "./pages/DestinationsList";
import DestinationDetails from "./pages/DestinationDetails";
import Checkout from "./pages/Checkout";
import Assistant from "./pages/Assistant";
import Support from "./pages/Support";
import VacationRentals from "./pages/VacationRentals";
import { useTranslation } from "react-i18next";

export default function App() {
  const { i18n } = useTranslation();
  return (
    <AuthProvider>
      <div
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-background)] text-gray-900"
      >
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<PropertiesList />} />
            <Route path="/vacation-rentals" element={<VacationRentals />} />
            <Route path="/hotels/:id" element={<PropertyDetails />} />
            <Route path="/destinations" element={<DestinationsList />} />
            <Route path="/destinations/:slug" element={<DestinationDetails />} />
            <Route path="/restaurants" element={<RestaurantsList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            <Route path="/activities" element={<ActivitiesList />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { AiCalling } from './pages/public/AiCalling';
import { Packages } from './pages/public/Packages';
import { Shop } from './pages/public/Shop';
import { Features } from './pages/public/Features';
import { About } from './pages/public/About';
import { WhyChooseUs } from './pages/public/WhyChooseUs';
import { Contact } from './pages/public/Contact';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AdminLogin } from './pages/auth/AdminLogin';
import { AdminForgotPassword } from './pages/auth/AdminForgotPassword';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import DGePayResult from './pages/payment/DGePayResult';
import MoneybagResult from './pages/payment/MoneybagResult';

// User Portal Pages
import { UserDashboard } from './pages/user/Dashboard';
import { MyIpPhone } from './pages/user/MyIpPhone';

import { UserRecharge } from './pages/user/Recharge';
import { UserTransactions } from './pages/user/Transactions';

import { UserMyPackages } from './pages/user/MyPackages';
import { UserMySubscriptions } from './pages/user/MySubscriptions';
import { UserOrders } from './pages/user/Orders';
import { UserShop } from './pages/user/Shop';
import { UserSupportTickets } from './pages/user/SupportTickets';
import { UserTicketDetail } from './pages/user/TicketDetail';
import { UserProfile } from './pages/user/Profile';
import { UserNotifications } from './pages/user/Notifications';
import { UserPayments } from './pages/user/Payments';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersManagement } from './pages/admin/UsersManagement';
import { AdminIpPhoneManagement } from './pages/admin/IpPhoneManagement';

import { AdminPackageManagement } from './pages/admin/PackageManagement';
import { AdminShopManagement } from './pages/admin/ShopManagement';
import { AdminOrderManagement } from './pages/admin/OrderManagement';
import { AdminRechargeManagement } from './pages/admin/RechargeManagement';
import { AdminTicketManagement } from './pages/admin/TicketManagement';
import { AdminPaymentSettings } from './pages/admin/PaymentSettings';
import { AdminContentManagement } from './pages/admin/ContentManagement';
import { AdminNavigationManagement } from './pages/admin/NavigationManagement';
import { AdminWebsiteSettings } from './pages/admin/WebsiteSettings';
import { AdminPaymentVerification } from './pages/admin/PaymentVerification';
import { AdminSubscriptionManagement } from './pages/admin/SubscriptionManagement';
import { AdminPaymentMethods } from './pages/admin/PaymentMethods';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminInquiries } from './pages/admin/AdminInquiries';
import { AdminProfile } from './pages/admin/AdminProfile';
import { CmsManager } from './pages/admin/cms/CmsManager';
import { HomePageManager } from './pages/admin/HomePageManager';
import { ContactPageManager } from './pages/admin/cms/ContactPageManager';
import { CmsAwarePage } from './pages/cms/CmsAwarePage';
import { CmsManagedPage } from './pages/cms/CmsManagedPage';
import { CloudPbx } from './pages/public/CloudPbx';
import { CallCenter } from './pages/public/CallCenter';
import { ProductLanding } from './pages/public/ProductLanding';
import FeaturePage from './pages/public/FeaturePage';
import DynamicCMSPage from './pages/public/DynamicCMSPage';
import FeaturePageManager from './pages/admin/cms/FeaturePageManager';
import { ProductGuides } from './pages/public/ProductGuides';
import { FaqHelpdesk } from './pages/public/FaqHelpdesk';
import { ComplianceBtrc } from './pages/public/ComplianceBtrc';
import { ResourceCmsManager } from './pages/admin/cms/ResourceCmsManager';
import { FinTechSolutionPage } from './pages/public/FinTechSolutionPage';
import { RemoteWorkforceSolutionPage } from './pages/public/RemoteWorkforceSolutionPage';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading MyBDPhone...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin || user.role === 'admin' || user.role === 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading Control Room...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="ip-phone" element={<ProductLanding />} />
            <Route path="business-ip-number" element={<ProductLanding />} />
            <Route path="virtual-number" element={<ProductLanding />} />
            <Route path="auto-dialer" element={<ProductLanding />} />
            <Route path="voice-broadcast" element={<ProductLanding />} />
            <Route path="ai-calling" element={<CmsAwarePage slug="ai-calling" fallback={<AiCalling />} />} />
            <Route path="ai-calling-automation" element={<DynamicCMSPage slug="ai-calling-automation" />} />
            <Route path="ai-bangla-voice-tts" element={<DynamicCMSPage slug="ai-calling-automation" />} />
            <Route path="packages" element={<CmsAwarePage slug="packages" fallback={<Packages />} />} />
            <Route path="shop" element={<CmsAwarePage slug="shop" fallback={<Shop />} />} />
            <Route path="features" element={<CmsAwarePage slug="features" fallback={<Features />} />} />
            <Route path="features/smart-ivr-routing" element={<DynamicCMSPage slug="smart-ivr-routing" />} />
            <Route path="features/ai-calling-automation" element={<DynamicCMSPage slug="ai-calling-automation" />} />
            <Route path="features/ai-bangla-voice-tts" element={<DynamicCMSPage slug="ai-calling-automation" />} />
            <Route path="features/call-recording" element={<DynamicCMSPage slug="call-recording" />} />
            <Route path="call-recording" element={<DynamicCMSPage slug="call-recording" />} />
            <Route path="features/:slug" element={<FeaturePage />} />
            <Route path="about" element={<About />} />
            <Route path="why-choose-us" element={<WhyChooseUs />} />
            <Route path="support" element={<Navigate to="/contact" replace />} />
            <Route path="knowledgebase" element={<Navigate to="/contact" replace />} />
            <Route path="help" element={<Navigate to="/contact" replace />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cloud-pbx" element={<CloudPbx />} />
            <Route path="call-center" element={<CallCenter />} />
            <Route path="solutions/fintech" element={<FinTechSolutionPage />} />
            <Route path="financial-fintech" element={<FinTechSolutionPage />} />
            <Route path="solutions/remote-workforce" element={<RemoteWorkforceSolutionPage />} />
            <Route path="remote-workforce" element={<RemoteWorkforceSolutionPage />} />
            <Route path="recharge" element={<Navigate to="/user/recharge" replace />} />
            <Route path="dashboard" element={<Navigate to="/user/dashboard" replace />} />
            
            {/* Resources Hub Routes */}
            <Route path="resources/product-guides" element={<ProductGuides />} />
            <Route path="resources/faq-helpdesk" element={<FaqHelpdesk />} />
            <Route path="resources/compliance-btrc" element={<ComplianceBtrc />} />
            <Route path="resources/guides" element={<ProductGuides />} />
            <Route path="resources/faq" element={<FaqHelpdesk />} />
            <Route path="resources/compliance" element={<ComplianceBtrc />} />
            <Route path="resources" element={<ProductGuides />} />

            {/* Any one-level public path created from Admin CMS can be published without adding React code. */}
            <Route path=":slug" element={<CmsManagedPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

          <Route path="/payment/dgepay/result" element={<DGePayResult />} />
          <Route path="/payment/moneybag/result" element={<MoneybagResult />} />
          <Route path="/page/:slug" element={<CmsManagedPage />} />

          {/* User Portal Routes */}
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <UserLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="ip-phone" element={<MyIpPhone />} />
            <Route path="ai-calling" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="recharge" element={<UserRecharge />} />
            <Route path="transactions" element={<UserTransactions />} />
            <Route path="calls" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="packages" element={<UserMyPackages />} />
            <Route path="subscriptions" element={<UserMySubscriptions />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="shop" element={<UserShop />} />
            <Route path="support" element={<UserSupportTickets />} />
            <Route path="support/:id" element={<UserTicketDetail />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="notifications" element={<UserNotifications />} />
            <Route path="payments" element={<UserPayments />} />
          </Route>

          {/* Admin Control Room Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersManagement />} />
            <Route path="ip-phone" element={<AdminIpPhoneManagement />} />
            <Route path="ai-calling" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="packages" element={<AdminPackageManagement />} />
            <Route path="shop" element={<AdminShopManagement />} />
            <Route path="orders" element={<AdminOrderManagement />} />
            <Route path="recharge" element={<AdminRechargeManagement />} />
            <Route path="tickets" element={<AdminTicketManagement />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="contact-inquiries" element={<AdminInquiries />} />
            <Route path="payments" element={<AdminPaymentVerification />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="payment-methods" element={<AdminPaymentMethods />} />
            <Route path="payment-settings" element={<AdminPaymentSettings />} />
            <Route path="subscriptions" element={<AdminSubscriptionManagement />} />
            <Route path="navigation" element={<AdminNavigationManagement />} />
            <Route path="cms" element={<AdminContentManagement />} />
            <Route path="cms/home" element={<HomePageManager />} />
            <Route path="cms/contact" element={<ContactPageManager />} />
            <Route path="cms/resources" element={<ResourceCmsManager />} />
            <Route path="cms/faq" element={<Navigate to="/admin/cms/resources" replace />} />
            <Route path="cms/features" element={<FeaturePageManager />} />
            <Route path="cms/:section" element={<CmsManager />} />
            <Route path="settings" element={<AdminWebsiteSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

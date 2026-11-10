import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CitizenPortal from './pages/CitizenPortal';
import ServiceForm from './pages/ServiceForm';
import Tracking from './pages/Tracking';
import Complaints from './pages/Complaints';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './pages/AuthModal';
import DigitalIdModal from './pages/DigitalIdModal';
import EDocumentModal from './components/common/EDocumentModal';
import { ToastProvider, useToast } from './components/common/Toast';
import { authService, INITIAL_USERS } from './services/storage';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // default: Aisyah Nafilah (masyarakat)
  const [activeRoute, setActiveRoute] = useState('portal'); // portal | form | tracking | complaints | officer | admin
  const [selectedService, setSelectedService] = useState(null);
  const [trackingRequestId, setTrackingRequestId] = useState(null);

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [digitalIdModalOpen, setDigitalIdModalOpen] = useState(false);
  const [edocModalOpen, setEdocModalOpen] = useState(false);
  const [selectedEdocReq, setSelectedEdocReq] = useState(null);

  const { showToast } = useToast();

  useEffect(() => {
    // Load persisted user session on mount
    authService.getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleSwitchRole = async (targetRole) => {
    try {
      const switchedUser = await authService.switchRole(targetRole);
      setCurrentUser(switchedUser);
      showToast(`Beralih ke peran: ${switchedUser.name} (${targetRole.toUpperCase()})`, 'info');

      // Auto redirect route based on role
      if (targetRole === 'petugas') {
        setActiveRoute('officer');
      } else if (targetRole === 'administrator') {
        setActiveRoute('admin');
      } else {
        setActiveRoute('portal');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setActiveRoute('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackRequest = (requestId) => {
    setTrackingRequestId(requestId);
    setActiveRoute('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewEdoc = (req) => {
    setSelectedEdocReq(req);
    setEdocModalOpen(true);
  };

  const handleFormSubmitSuccess = (newReq) => {
    setTrackingRequestId(newReq.id);
    setActiveRoute('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* 1. Global Navigation Header */}
      <Header
        currentUser={currentUser}
        activeRoute={activeRoute}
        onRouteChange={(route) => {
          setActiveRoute(route);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDigitalId={() => setDigitalIdModalOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      {/* 2. Main Body Container (with 64px padding-top for fixed header) */}
      <main className="flex-1 pt-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Route: Portal Masyarakat */}
        {activeRoute === 'portal' && (
          <CitizenPortal
            currentUser={currentUser}
            onNavigate={(route) => setActiveRoute(route)}
            onSelectService={handleSelectService}
            onTrackRequest={handleTrackRequest}
            onViewEdoc={handleViewEdoc}
            onOpenDigitalId={() => setDigitalIdModalOpen(true)}
          />
        )}

        {/* Route: Formulir Pelayanan */}
        {activeRoute === 'form' && (
          <ServiceForm
            service={selectedService}
            currentUser={currentUser}
            onBack={() => setActiveRoute('portal')}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        )}

        {/* Route: Pelacakan Permohonan */}
        {activeRoute === 'tracking' && (
          <Tracking
            initialRequestId={trackingRequestId}
            currentUser={currentUser}
            onViewEdoc={handleViewEdoc}
          />
        )}

        {/* Route: Pengaduan Warga */}
        {activeRoute === 'complaints' && (
          <Complaints currentUser={currentUser} />
        )}

        {/* Route: Dashboard Petugas */}
        {activeRoute === 'officer' && (
          <OfficerDashboard
            currentUser={currentUser}
            onViewEdoc={handleViewEdoc}
          />
        )}

        {/* Route: Dashboard Administrator */}
        {activeRoute === 'admin' && (
          <AdminDashboard currentUser={currentUser} />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'petugas') setActiveRoute('officer');
          else if (user.role === 'administrator') setActiveRoute('admin');
          else setActiveRoute('portal');
        }}
      />

      <DigitalIdModal
        isOpen={digitalIdModalOpen}
        onClose={() => setDigitalIdModalOpen(false)}
        user={currentUser}
      />

      <EDocumentModal
        isOpen={edocModalOpen}
        onClose={() => setEdocModalOpen(false)}
        request={selectedEdocReq}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}


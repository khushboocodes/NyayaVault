import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import MfaPage from './views/MfaPage';
import RoleSelectPage from './views/RoleSelectPage';
import DashboardPage from './views/DashboardPage';
import CaseManagementPage from './views/CaseManagementPage';
import CaseDetailsPage from './views/CaseDetailsPage';
import DocumentIngestionPage from './views/DocumentIngestionPage';
import DocumentViewerPage from './views/DocumentViewerPage';
import VerificationPortalPage from './views/VerificationPortalPage';
import ChainOfCustodyPage from './views/ChainOfCustodyPage';
import BsaCertificatePage from './views/BsaCertificatePage';
import AuditTrailPage from './views/AuditTrailPage';
import MobileAppSimulatorPage from './views/MobileAppSimulatorPage';

import { INITIAL_CASES, INITIAL_DOCUMENTS } from './data/mockData';
import { DEFAULT_ROLE, ROLES } from './data/rolesData';

// Mapping from URL pathname to NyayaVault internal screen IDs
const PATH_TO_SCREEN = {
  '/': 'landing',
  '/landing': 'landing',
  '/login': 'login',
  '/mfa': 'mfa',
  '/role-select': 'role-select',
  '/dashboard': 'dashboard',
  '/cases': 'cases',
  '/case-details': 'case-details',
  '/upload': 'upload',
  '/redaction': 'upload',
  '/documents': 'documents',
  '/document-viewer': 'document-viewer',
  '/verification': 'verification',
  '/custody': 'custody',
  '/certificates': 'certificates',
  '/audit': 'audit',
  '/mobile-app': 'mobile-app',
  '/settings': 'settings'
};

// Mapping from NyayaVault internal screen IDs to URL pathname
const SCREEN_TO_PATH = {
  landing: '/landing',
  login: '/login',
  mfa: '/mfa',
  'role-select': '/role-select',
  dashboard: '/dashboard',
  cases: '/cases',
  'case-details': '/case-details',
  upload: '/upload',
  documents: '/documents',
  'document-viewer': '/document-viewer',
  verification: '/verification',
  custody: '/custody',
  certificates: '/certificates',
  audit: '/audit',
  'mobile-app': '/mobile-app',
  settings: '/settings'
};

// Unauthenticated / public portal screens
const PUBLIC_SCREENS = new Set(['landing', 'login', 'mfa', 'role-select']);

// Compute synchronous initial state to prevent any layout flash or redirect loop
function getInitialNavigationState() {
  const isAuth = typeof window !== 'undefined' && sessionStorage.getItem('nyayavault_auth') === 'true';
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const screenFromPath = PATH_TO_SCREEN[path];

  if (isAuth) {
    // Authenticated user attempting to access public entry route (login, landing, etc.)
    // Redirect / keep inside their protected dashboard
    if (!screenFromPath || PUBLIC_SCREENS.has(screenFromPath)) {
      if (typeof window !== 'undefined') {
        window.history.replaceState({ screen: 'dashboard' }, '', '/dashboard');
      }
      return { isAuthenticated: true, screen: 'dashboard' };
    }
    // Authenticated user accessing valid protected screen
    if (typeof window !== 'undefined') {
      window.history.replaceState({ screen: screenFromPath }, '', path);
    }
    return { isAuthenticated: true, screen: screenFromPath };
  } else {
    // Unauthenticated user attempting to access protected route (/dashboard, /cases, etc.)
    // Redirect to login
    if (screenFromPath && !PUBLIC_SCREENS.has(screenFromPath)) {
      if (typeof window !== 'undefined') {
        window.history.replaceState({ screen: 'login' }, '', '/login');
      }
      return { isAuthenticated: false, screen: 'login' };
    }
    // Unauthenticated landing route
    if (!screenFromPath || screenFromPath === 'landing') {
      if (typeof window !== 'undefined' && path !== '/landing' && path !== '/') {
        window.history.replaceState({ screen: 'landing' }, '', '/landing');
      }
      return { isAuthenticated: false, screen: 'landing' };
    }
    // Other public screens (/login, etc.)
    if (typeof window !== 'undefined') {
      window.history.replaceState({ screen: screenFromPath }, '', path);
    }
    return { isAuthenticated: false, screen: screenFromPath };
  }
}

export default function App() {
  // Navigation & Authentication state
  const initialNav = getInitialNavigationState();
  const [isAuthenticated, setIsAuthenticated] = useState(initialNav.isAuthenticated);
  const [currentScreen, _setCurrentScreen] = useState(initialNav.screen);
  
  // Data State
  const [cases, setCases] = useState(INITIAL_CASES);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);

  // Restore selectedCase and selectedDoc from sessionStorage across page refresh
  const [selectedCase, setSelectedCase] = useState(() => {
    const savedCaseId = typeof window !== 'undefined' ? sessionStorage.getItem('nyayavault_case_id') : null;
    return INITIAL_CASES.find(c => c.id === savedCaseId) || INITIAL_CASES[0];
  });
  const [selectedDoc, setSelectedDoc] = useState(() => {
    const savedDocId = typeof window !== 'undefined' ? sessionStorage.getItem('nyayavault_doc_id') : null;
    return INITIAL_DOCUMENTS.find(d => d.id === savedDocId) || INITIAL_DOCUMENTS[0];
  });
  
  // Auth & Role State - preserved in sessionStorage
  const [userRole, setUserRole] = useState(() => {
    const savedRoleId = typeof window !== 'undefined' ? sessionStorage.getItem('nyayavault_role_id') : null;
    return ROLES.find(r => r.id === savedRoleId) || DEFAULT_ROLE;
  });

  // Offline Simulation State
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(4);

  // Sync state to sessionStorage for survival across refresh
  useEffect(() => {
    if (selectedCase?.id) {
      sessionStorage.setItem('nyayavault_case_id', selectedCase.id);
    }
  }, [selectedCase]);

  useEffect(() => {
    if (selectedDoc?.id) {
      sessionStorage.setItem('nyayavault_doc_id', selectedDoc.id);
    }
  }, [selectedDoc]);

  useEffect(() => {
    if (userRole?.id) {
      sessionStorage.setItem('nyayavault_role_id', userRole.id);
    }
  }, [userRole]);

  // Add new document to mock database
  const addNewDocument = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  // Authentication: Successful login
  const handleLogin = (role) => {
    const roleToSet = role || userRole || DEFAULT_ROLE;
    sessionStorage.setItem('nyayavault_auth', 'true');
    sessionStorage.setItem('nyayavault_role_id', roleToSet.id);
    setUserRole(roleToSet);
    setIsAuthenticated(true);

    // Replace login in history with dashboard so login is not accessible via Back
    window.history.replaceState({ screen: 'dashboard' }, '', '/dashboard');
    _setCurrentScreen('dashboard');
  };

  // Explicit Logout: Clear authentication and return to Login
  const handleLogout = () => {
    sessionStorage.removeItem('nyayavault_auth');
    sessionStorage.removeItem('nyayavault_role_id');
    sessionStorage.removeItem('nyayavault_case_id');
    sessionStorage.removeItem('nyayavault_doc_id');
    setIsAuthenticated(false);

    // Return to Login page with normal unauthenticated history
    window.history.replaceState({ screen: 'login' }, '', '/login');
    _setCurrentScreen('login');
  };

  // Authentication-aware navigation function
  const navigateToScreen = (nextScreen, options = {}) => {
    const isAuth = sessionStorage.getItem('nyayavault_auth') === 'true';
    const targetPath = SCREEN_TO_PATH[nextScreen] || '/dashboard';

    // Route Guard 1: If unauthenticated and attempting to access protected route, redirect to login
    if (!isAuth && !PUBLIC_SCREENS.has(nextScreen)) {
      window.history.replaceState({ screen: 'login' }, '', '/login');
      _setCurrentScreen('login');
      return;
    }

    // Route Guard 2: If authenticated and attempting to access public route (without explicit logout), keep on dashboard
    if (isAuth && PUBLIC_SCREENS.has(nextScreen)) {
      window.history.replaceState({ screen: 'dashboard' }, '', '/dashboard');
      _setCurrentScreen('dashboard');
      return;
    }

    // Same screen and path check
    if (nextScreen === currentScreen && window.location.pathname === targetPath) {
      return;
    }

    if (options.replace) {
      window.history.replaceState({ screen: nextScreen }, '', targetPath);
    } else {
      window.history.pushState({ screen: nextScreen }, '', targetPath);
    }

    _setCurrentScreen(nextScreen);
  };

  // Browser Popstate / Back button listener
  useEffect(() => {
    const handlePopState = (event) => {
      const isAuth = sessionStorage.getItem('nyayavault_auth') === 'true';
      const path = window.location.pathname;
      const targetScreen = event.state?.screen || PATH_TO_SCREEN[path] || (isAuth ? 'dashboard' : 'landing');

      if (isAuth) {
        // Authenticated Session:
        // Back navigation MUST NOT exit the protected application to Login or Landing
        if (PUBLIC_SCREENS.has(targetScreen)) {
          // Push dashboard back to history and prevent exit
          window.history.pushState({ screen: 'dashboard' }, '', '/dashboard');
          _setCurrentScreen('dashboard');
        } else {
          // Internal dashboard navigation works normally
          _setCurrentScreen(targetScreen);
        }
      } else {
        // Unauthenticated Session:
        if (!PUBLIC_SCREENS.has(targetScreen)) {
          // Unauthenticated user attempting to access protected screen via Back
          window.history.replaceState({ screen: 'login' }, '', '/login');
          _setCurrentScreen('login');
        } else {
          // Unauthenticated navigation works normally (Login <-> Landing)
          _setCurrentScreen(targetScreen);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Standalone full-page screens (Unauthenticated or public screens)
  const isStandalonePage = !isAuthenticated || PUBLIC_SCREENS.has(currentScreen);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      
      {/* 1. PUBLIC LANDING PAGE (Screen 1) */}
      {currentScreen === 'landing' && (
        <LandingPage setCurrentScreen={navigateToScreen} />
      )}

      {/* 2. LOGIN PAGE (Screen 2: Login + Integrated RBAC) */}
      {currentScreen === 'login' && (
        <LoginPage 
          setCurrentScreen={navigateToScreen} 
          setUserRole={setUserRole}
          userRole={userRole}
          onLogin={handleLogin}
        />
      )}

      {/* 3. MFA 2FA PAGE (Screen 3) */}
      {currentScreen === 'mfa' && (
        <MfaPage 
          setCurrentScreen={navigateToScreen} 
          userRole={userRole}
          onLogin={handleLogin}
        />
      )}

      {/* 4. ROLE & ORGANIZATION SELECTION (Internal fallback / Reusable) */}
      {currentScreen === 'role-select' && (
        <RoleSelectPage 
          setCurrentScreen={navigateToScreen} 
          setUserRole={setUserRole}
          onLogin={handleLogin}
        />
      )}

      {/* 5-18. AUTHENTICATED APPLICATION WORKSPACE (With Persistent Sidebar & TopBar) */}
      {!isStandalonePage && (
        <div className="app-container">
          {/* Persistent Sidebar with Role-Filtered Navigation */}
          <Sidebar 
            currentScreen={currentScreen} 
            setCurrentScreen={navigateToScreen} 
            userRole={userRole}
            onLogout={handleLogout}
          />

          <div className="app-main">
            {/* Topbar with greeting, network status, avatar */}
            <TopNav 
              currentScreen={currentScreen} 
              setCurrentScreen={navigateToScreen} 
              userRole={userRole}
              onLogout={handleLogout}
              isOffline={isOffline}
              setIsOffline={setIsOffline}
              offlineQueueCount={offlineQueueCount}
            />

            {/* Dynamic Screen Content */}
            <main className="app-content">
              {currentScreen === 'dashboard' && (
                <DashboardPage 
                  setCurrentScreen={navigateToScreen}
                  cases={cases}
                  documents={documents}
                  setSelectedCase={setSelectedCase}
                  setSelectedDoc={setSelectedDoc}
                  userRole={userRole}
                />
              )}

              {currentScreen === 'cases' && (
                <CaseManagementPage 
                  cases={cases}
                  setCurrentScreen={navigateToScreen}
                  setSelectedCase={setSelectedCase}
                />
              )}

              {currentScreen === 'case-details' && (
                <CaseDetailsPage 
                  selectedCase={selectedCase}
                  documents={documents}
                  setCurrentScreen={navigateToScreen}
                  setSelectedDoc={setSelectedDoc}
                />
              )}

              {currentScreen === 'upload' && (
                <DocumentIngestionPage 
                  setCurrentScreen={navigateToScreen}
                  addNewDocument={addNewDocument}
                  setSelectedDoc={setSelectedDoc}
                />
              )}

              {(currentScreen === 'documents' || currentScreen === 'document-viewer') && (
                <DocumentViewerPage 
                  selectedDoc={selectedDoc}
                  setCurrentScreen={navigateToScreen}
                />
              )}

              {currentScreen === 'verification' && (
                <VerificationPortalPage 
                  setCurrentScreen={navigateToScreen}
                />
              )}

              {currentScreen === 'custody' && (
                <ChainOfCustodyPage 
                  setCurrentScreen={navigateToScreen}
                />
              )}

              {currentScreen === 'certificates' && (
                <BsaCertificatePage 
                  setCurrentScreen={navigateToScreen}
                  selectedDoc={selectedDoc}
                />
              )}

              {currentScreen === 'audit' && (
                <AuditTrailPage 
                  setCurrentScreen={navigateToScreen}
                />
              )}

              {currentScreen === 'mobile-app' && (
                <MobileAppSimulatorPage 
                  setCurrentScreen={navigateToScreen}
                />
              )}

              {currentScreen === 'settings' && (
                <div className="nyaya-card">
                  <h3 style={{ fontSize: '18px', color: '#FFF', marginBottom: '8px' }}>
                    Institutional & Consortium Settings
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Hyperledger Fabric Channel: <code>police-court-consortium</code> • Node Peer ID: <code>peer0.org1.cgpolice.gov.in</code>
                  </p>
                  <div style={{ marginTop: '20px' }}>
                    <button onClick={() => navigateToScreen('dashboard')} className="btn-gold">
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

    </div>
  );
}


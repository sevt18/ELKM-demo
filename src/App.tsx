import React, { useState, useEffect } from 'react';
import { Kit, KitStatus, TriageOption, ReturnLog, ServiceRecord, UserProfile, DispatchEvent } from './types/elkm';
import { INITIAL_KITS, INITIAL_LOGS, INITIAL_DISPATCHES } from './data/mockKits';
import { Header } from './components/Header';
import { ActiveTab } from './components/Navigation';
import { InventoryView } from './components/InventoryView';
import { ReturnsView } from './components/ReturnsView';
import { AlertsView } from './components/AlertsView';
import { MaintenanceView } from './components/MaintenanceView';
import { DispatchCalendarView } from './modules/dispatch/DispatchCalendarView';
import { NewDispatchModal } from './modules/dispatch/NewDispatchModal';
import { NewKitModal } from './modules/inventory/NewKitModal';
import { KitDetailModal } from './components/KitDetailModal';
import { MaintenanceActionModal } from './components/MaintenanceActionModal';
import { TechnicalArchitectureModal } from './modules/docs/TechnicalArchitectureModal';
import { LoginScreen } from './modules/auth/LoginScreen';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, FIREBASE_PROJECT_NAME, FIREBASE_PROJECT_INFO } from './firebase/config';
import {
  subscribeKits,
  subscribeDispatches,
  subscribeReturnLogs,
  saveKitToFirestore,
  updateKitInFirestore,
  saveDispatchToFirestore,
  updateDispatchInFirestore,
  saveReturnLogToFirestore,
  seedInitialDataIfEmpty,
  resetDatabaseToDefaults,
} from './firebase/firestoreService';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Core Datasets
  const [kits, setKits] = useState<Kit[]>(INITIAL_KITS);
  const [dispatches, setDispatches] = useState<DispatchEvent[]>(INITIAL_DISPATCHES);
  const [returnLogs, setReturnLogs] = useState<ReturnLog[]>(INITIAL_LOGS);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('inventory');
  const [preSelectedKitId, setPreSelectedKitId] = useState<string | undefined>(undefined);

  // Modals State
  const [selectedKitForDetail, setSelectedKitForDetail] = useState<Kit | null>(null);
  const [serviceKit, setServiceKit] = useState<Kit | null>(null);
  const [isNewKitOpen, setIsNewKitOpen] = useState(false);
  const [isNewDispatchOpen, setIsNewDispatchOpen] = useState(false);
  const [isTechnicalDocsOpen, setIsTechnicalDocsOpen] = useState(false);

  // Listen to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (!currentUser) {
          const profile: UserProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Administrador',
            email: firebaseUser.email || 'admin@firebase.local',
            role: 'admin',
            roleTitle: 'Administrador General de Bodega',
            avatarInitials: (firebaseUser.displayName || 'AD')
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase(),
          };
          setCurrentUser(profile);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, [currentUser]);

  // Subscribe to real-time Firestore collections when user is authenticated
  useEffect(() => {
    if (!currentUser || !auth.currentUser) return;

    // Real-time listener for Kits
    const unsubKits = subscribeKits((updatedKits) => {
      if (updatedKits && updatedKits.length > 0) {
        setKits(updatedKits);
      }
    });

    // Real-time listener for Dispatches
    const unsubDispatches = subscribeDispatches((updatedDispatches) => {
      if (updatedDispatches && updatedDispatches.length > 0) {
        setDispatches(updatedDispatches);
      }
    });

    // Real-time listener for Return Logs
    const unsubLogs = subscribeReturnLogs((updatedLogs) => {
      if (updatedLogs && updatedLogs.length > 0) {
        setReturnLogs(updatedLogs);
      }
    });

    return () => {
      unsubKits();
      unsubDispatches();
      unsubLogs();
    };
  }, [currentUser]);

  // If administrator is not logged in, show clean login screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setActiveTab('inventory');
        }}
      />
    );
  }

  // Business Logic: Process Event Return (+1 Cycle & Dynamic Triage) with Firestore Sync
  const handleProcessReturn = (
    kitId: string,
    eventName: string,
    operatorName: string,
    triageResult: TriageOption,
    notes: string,
    evidenceImageUrl?: string
  ): { log: ReturnLog; updatedKit: Kit } => {
    let resultingStatus: KitStatus = 'disponible';
    let previousCycles = 0;
    let newCycles = 1;
    let thresholdReached = false;
    let updatedKitInstance: Kit | null = null;

    const targetKit = kits.find((k) => k.id === kitId);
    if (targetKit) {
      previousCycles = targetKit.currentCycles;
      newCycles = previousCycles + 1;
      thresholdReached = newCycles >= targetKit.cycleThreshold;

      if (triageResult === 'critico') {
        resultingStatus = 'bloqueado';
      } else if (triageResult === 'calibracion') {
        resultingStatus = 'mantenimiento';
      } else {
        resultingStatus = thresholdReached ? 'mantenimiento' : 'disponible';
      }

      const updated: Kit = {
        ...targetKit,
        currentCycles: newCycles,
        status: resultingStatus,
        lastEventName: eventName,
        lastReturnDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        lastTriageResult: triageResult,
        assignedEventName: undefined,
        notes:
          triageResult !== 'optimo'
            ? `Retorno [${triageResult.toUpperCase()}]: ${notes}`
            : thresholdReached
            ? `Umbral alcanzado (${newCycles}/${targetKit.cycleThreshold}). Requiere preventivo.`
            : targetKit.notes,
      };

      updatedKitInstance = updated;

      // Persist Kit to Firestore
      saveKitToFirestore(updated).catch(console.error);

      // Optimistic local update
      setKits((prevKits) => prevKits.map((k) => (k.id === kitId ? updated : k)));
    }

    // Update matching dispatch in Firestore
    dispatches.forEach((disp) => {
      if (disp.kitIds.includes(kitId) && disp.status === 'en_evento') {
        updateDispatchInFirestore(disp.id, { status: 'retornado' }).catch(console.error);
      }
    });

    const nowString = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newLog: ReturnLog = {
      id: `RET-${Date.now().toString().slice(-6)}`,
      kitId,
      kitName: targetKit ? targetKit.name : kitId,
      eventName,
      operatorName,
      timestamp: nowString,
      triageResult,
      notes,
      previousCycles,
      newCycles,
      resultingStatus,
      thresholdReached,
      evidenceImageUrl,
    };

    // Persist Log to Firestore
    saveReturnLogToFirestore(newLog).catch(console.error);
    setReturnLogs((prev) => [newLog, ...prev]);

    return {
      log: newLog,
      updatedKit: updatedKitInstance || {
        ...targetKit!,
        currentCycles: newCycles,
        status: resultingStatus,
      },
    };
  };

  // Dispatch Action: Send kits to field
  const handleDispatchToField = (dispatchId: string) => {
    const targetDispatch = dispatches.find((d) => d.id === dispatchId);
    if (!targetDispatch) return;

    // Update dispatch in Firestore
    updateDispatchInFirestore(dispatchId, { status: 'en_evento' }).catch(console.error);
    setDispatches((prev) =>
      prev.map((d) => (d.id === dispatchId ? { ...d, status: 'en_evento' } : d))
    );

    // Update kits in Firestore
    targetDispatch.kitIds.forEach((kid) => {
      updateKitInFirestore(kid, {
        status: 'en_evento',
        assignedEventName: targetDispatch.eventName,
      }).catch(console.error);
    });

    setKits((prev) =>
      prev.map((kit) =>
        targetDispatch.kitIds.includes(kit.id)
          ? {
              ...kit,
              status: 'en_evento',
              assignedEventName: targetDispatch.eventName,
            }
          : kit
      )
    );
  };

  // Add new dispatch
  const handleAddDispatch = (newEvent: DispatchEvent) => {
    saveDispatchToFirestore(newEvent).catch(console.error);
    setDispatches((prev) => [newEvent, ...prev]);
  };

  // Maintenance & Lock actions
  const handleSendToMaintenance = (kitId: string) => {
    const notes = 'Trasladado a taller técnico por revisión preventiva.';
    updateKitInFirestore(kitId, {
      status: 'mantenimiento',
      notes,
    }).catch(console.error);

    setKits((prev) =>
      prev.map((k) =>
        k.id === kitId
          ? {
              ...k,
              status: 'mantenimiento',
              notes,
            }
          : k
      )
    );
  };

  const handleLockKit = (kitId: string) => {
    const notes = 'Bloqueado por prevención técnica y riesgo operativo.';
    updateKitInFirestore(kitId, {
      status: 'bloqueado',
      notes,
    }).catch(console.error);

    setKits((prev) =>
      prev.map((k) =>
        k.id === kitId
          ? {
              ...k,
              status: 'bloqueado',
              notes,
            }
          : k
      )
    );
  };

  const handleUpdateStatus = (kitId: string, newStatus: KitStatus) => {
    updateKitInFirestore(kitId, { status: newStatus }).catch(console.error);

    setKits((prev) =>
      prev.map((k) => (k.id === kitId ? { ...k, status: newStatus } : k))
    );
    if (selectedKitForDetail && selectedKitForDetail.id === kitId) {
      setSelectedKitForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCompleteService = (
    kitId: string,
    technician: string,
    serviceType: 'Preventivo' | 'Correctivo' | 'Calibración' | 'Overhaul',
    notes: string,
    resetCycles: boolean,
    reportAttachmentUrl?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const targetKit = kits.find((k) => k.id === kitId);
    if (!targetKit) return;

    const newRecord: ServiceRecord = {
      id: `SRV-${Date.now().toString().slice(-4)}`,
      date: today,
      technician,
      type: serviceType,
      notes,
      cyclesAtService: targetKit.currentCycles,
      cyclesResetToZero: resetCycles,
      reportAttachmentUrl,
    };

    const updated: Kit = {
      ...targetKit,
      status: 'disponible',
      currentCycles: resetCycles ? 0 : targetKit.currentCycles,
      serviceHistory: [newRecord, ...targetKit.serviceHistory],
      notes: `Servicio completado: ${serviceType}. Listo para operación.`,
    };

    saveKitToFirestore(updated).catch(console.error);

    setKits((prev) =>
      prev.map((k) => (k.id === kitId ? updated : k))
    );
  };

  const handleAddKit = (newKit: Kit) => {
    saveKitToFirestore(newKit).catch(console.error);
    setKits((prev) => [newKit, ...prev]);
  };

  const handleResetDemoData = async () => {
    try {
      await resetDatabaseToDefaults();
      setKits(INITIAL_KITS);
      setDispatches(INITIAL_DISPATCHES);
      setReturnLogs(INITIAL_LOGS);
    } catch (err) {
      console.error('Error al resetear datos:', err);
    }
  };

  const handleSelectKitForReturn = (kitId: string) => {
    setPreSelectedKitId(kitId);
    setActiveTab('returns');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-20 md:pb-12 selection:bg-slate-900 selection:text-white">
      
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewKit={() => setIsNewKitOpen(true)}
        onResetDemoData={handleResetDemoData}
        onLogout={handleLogout}
        onOpenDocs={() => setIsTechnicalDocsOpen(true)}
        currentUser={currentUser}
        kits={kits}
        dispatches={dispatches}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Module 1: Inventory */}
        {activeTab === 'inventory' && (
          <InventoryView
            kits={kits}
            onSelectKitForReturn={handleSelectKitForReturn}
            onOpenKitDetails={(kit) => setSelectedKitForDetail(kit)}
            onSendToMaintenance={handleSendToMaintenance}
            onOpenNewKit={() => setIsNewKitOpen(true)}
          />
        )}

        {/* Module 2: Dispatch & Calendar */}
        {activeTab === 'dispatch' && (
          <DispatchCalendarView
            dispatches={dispatches}
            kits={kits}
            onOpenNewDispatch={() => setIsNewDispatchOpen(true)}
            onDispatchToField={handleDispatchToField}
            onSelectForReturn={handleSelectKitForReturn}
          />
        )}

        {/* Module 3: Returns */}
        {activeTab === 'returns' && (
          <ReturnsView
            kits={kits}
            preSelectedKitId={preSelectedKitId}
            onProcessReturn={handleProcessReturn}
            returnLogs={returnLogs}
          />
        )}

        {/* Module 4: Maintenance */}
        {activeTab === 'maintenance' && (
          <MaintenanceView
            kits={kits}
            onOpenServiceAction={(kit) => setServiceKit(kit)}
            onOpenKitDetails={(kit) => setSelectedKitForDetail(kit)}
          />
        )}

        {/* Module 5: Alerts */}
        {activeTab === 'alerts' && (
          <AlertsView
            kits={kits}
            onSendToMaintenance={handleSendToMaintenance}
            onLockKit={handleLockKit}
            onOpenKitDetails={(kit) => setSelectedKitForDetail(kit)}
            onNavigateToMaintenance={() => setActiveTab('maintenance')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span>ELKM · Event Lifecycle & Kit Manager</span>
            <button
              onClick={() => setIsTechnicalDocsOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{FIREBASE_PROJECT_NAME}</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-400 hidden md:inline">
              BD: {FIREBASE_PROJECT_INFO.firestoreDatabaseId.slice(0, 16)}...
            </span>
            <span className="font-mono text-slate-600">
              Sesión: {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isTechnicalDocsOpen && (
        <TechnicalArchitectureModal
          onClose={() => setIsTechnicalDocsOpen(false)}
        />
      )}
      {isNewKitOpen && (
        <NewKitModal
          onClose={() => setIsNewKitOpen(false)}
          onAddKit={handleAddKit}
        />
      )}

      {isNewDispatchOpen && (
        <NewDispatchModal
          kits={kits}
          onClose={() => setIsNewDispatchOpen(false)}
          onAddDispatch={handleAddDispatch}
        />
      )}

      {selectedKitForDetail && (
        <KitDetailModal
          kit={selectedKitForDetail}
          onClose={() => setSelectedKitForDetail(null)}
          onUpdateStatus={handleUpdateStatus}
          onSelectForReturn={handleSelectKitForReturn}
          onOpenMaintenanceModal={(kit) => setServiceKit(kit)}
        />
      )}

      {serviceKit && (
        <MaintenanceActionModal
          kit={serviceKit}
          onClose={() => setServiceKit(null)}
          onCompleteService={handleCompleteService}
        />
      )}

    </div>
  );
}

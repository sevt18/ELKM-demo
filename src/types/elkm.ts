export type KitStatus = 'disponible' | 'en_evento' | 'mantenimiento' | 'bloqueado';

export type UserRole = 'admin' | 'warehouse' | 'technician';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarInitials: string;
}

export type EquipmentCategory = 
  | 'Iluminación' 
  | 'Audio' 
  | 'Video & Pantallas' 
  | 'Efectos Especiales' 
  | 'Estructuras & Rigging';

export type TriageOption = 'optimo' | 'calibracion' | 'critico';

export interface ServiceRecord {
  id: string;
  date: string;
  technician: string;
  type: 'Preventivo' | 'Correctivo' | 'Calibración' | 'Overhaul';
  notes: string;
  cyclesAtService: number;
  cyclesResetToZero: boolean;
  reportAttachmentUrl?: string;
}

export interface KitComponentItem {
  id: string;
  name: string;
  quantity: number;
  serialOrSpec?: string;
}

export interface Kit {
  id: string;
  sku: string;
  name: string;
  category: EquipmentCategory;
  location: string;
  currentCycles: number;
  cycleThreshold: number;
  status: KitStatus;
  specs: string;
  components: KitComponentItem[];
  lastEventName: string;
  lastReturnDate: string;
  lastTriageResult?: TriageOption | 'nuevo';
  serviceHistory: ServiceRecord[];
  assignedEventId?: string;
  assignedEventName?: string;
  notes?: string;
  imageUrl?: string;
  manualUrl?: string;
}

export interface DispatchEvent {
  id: string;
  code: string;
  eventName: string;
  client: string;
  venue: string;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;    // YYYY-MM-DD
  status: 'programado' | 'en_evento' | 'retornado';
  kitIds: string[];
  operatorLead: string;
  notes: string;
}

export interface ReturnLog {
  id: string;
  kitId: string;
  kitName: string;
  eventName: string;
  operatorName: string;
  timestamp: string;
  triageResult: TriageOption;
  notes: string;
  previousCycles: number;
  newCycles: number;
  resultingStatus: KitStatus;
  thresholdReached: boolean;
  evidenceImageUrl?: string;
}

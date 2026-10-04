export enum ProjectStatus {
  DRAFT = 'DRAFT',
  QUOTE = 'QUOTE',
  INSURED = 'INSURED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED'
}

export enum EquipmentCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  DAMAGED = 'DAMAGED'
}

export interface ClientDTO {
  id?: number;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
}

export interface AgreementDTO {
  id?: number;
  documentName: string;
  clientEquipmentDetected?: boolean;
  freelancerLiable?: boolean;
  liabilityScope?: string;
  extractedLiabilityText?: string;
  reviewStatus?: string;
}

export interface EquipmentDTO {
  id?: number;
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  declaredValue: number;
  condition: EquipmentCondition;
  ownerName?: string;
  ownershipEvidence?: string;
  handedOver?: boolean;
  returned?: boolean;
}

export interface ProjectDetailsDTO {
  id: number;
  userId: number;
  projectName: string;
  description?: string;
  location?: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: ProjectStatus;
  policyNumber?: string;
  createdAt?: string;

  client?: ClientDTO;
  agreement?: AgreementDTO;
  equipmentList?: EquipmentDTO[];

  handoverCompleted?: boolean;
  handoverDate?: string;
  returnCompleted?: boolean;
}

export interface CreateProjectRequest {
  projectName: string;
  description?: string;
  location?: string;
  startDate: string;
  expectedEndDate: string;
  clientName: string;
  clientCompanyName?: string;
  clientEmail: string;
  clientPhone?: string;
}

export interface AgreementUploadRequest {
  documentName: string;
  documentText: string;
}

export interface AddEquipmentRequest {
  equipmentType: string;
  brand: string;
  model: string;
  serialNumber: string;
  declaredValue: number;
  condition: EquipmentCondition;
  ownershipEvidence?: string;
  photoUrl?: string;
}

export interface HandoverItemDTO {
  equipmentId: number;
  condition: EquipmentCondition;
  clientConfirmation?: boolean;
  freelancerConfirmation?: boolean;
  notes?: string;
}

export interface HandoverRequest {
  projectId?: number;
  handoverDate: string;
  items: HandoverItemDTO[];
}

export interface ReturnItemDTO {
  equipmentId: number;
  returnCondition: EquipmentCondition;
  clientConfirmedReturn?: boolean;
  returnNotes?: string;
}

export interface ReturnEquipmentRequest {
  projectId?: number;
  returnDate: string;
  items: ReturnItemDTO[];
}

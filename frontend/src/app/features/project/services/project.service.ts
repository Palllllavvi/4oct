import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  AddEquipmentRequest,
  AgreementUploadRequest,
  CreateProjectRequest,
  HandoverRequest,
  ProjectDetailsDTO,
  ReturnEquipmentRequest
} from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/projects`;

  /**
   * Create a new project (ROLE_FREELANCER)
   * POST /api/projects
   */
  createProject(request: CreateProjectRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.post<ApiResponse<ProjectDetailsDTO>>(this.baseUrl, request);
  }

  /**
   * Get projects for logged-in freelancer
   * GET /api/projects
   */
  getMyProjects(): Observable<ApiResponse<ProjectDetailsDTO[]>> {
    return this.http.get<ApiResponse<ProjectDetailsDTO[]>>(this.baseUrl);
  }

  /**
   * Get all projects across platform (Admin / Underwriter / Assessor)
   * GET /api/projects/all
   */
  getAllProjects(): Observable<ApiResponse<ProjectDetailsDTO[]>> {
    return this.http.get<ApiResponse<ProjectDetailsDTO[]>>(`${this.baseUrl}/all`);
  }

  /**
   * Get project details by ID
   * GET /api/projects/{id}
   */
  getProjectById(id: number | string): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.get<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload agreement document for liability analysis
   * POST /api/projects/{id}/agreement
   */
  uploadAgreement(id: number | string, request: AgreementUploadRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.post<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}/agreement`, request);
  }

  /**
   * Register equipment under a project
   * POST /api/projects/{id}/equipment
   */
  addEquipment(id: number | string, request: AddEquipmentRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.post<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}/equipment`, request);
  }

  /**
   * Record equipment handover & custody confirmation
   * POST /api/projects/{id}/handover
   */
  recordHandover(id: number | string, request: HandoverRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.post<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}/handover`, request);
  }

  /**
   * Record equipment return and project completion
   * POST /api/projects/{id}/return
   */
  recordReturn(id: number | string, request: ReturnEquipmentRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.http.post<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}/return`, request);
  }

  returnEquipment(id: number | string, request: ReturnEquipmentRequest): Observable<ApiResponse<ProjectDetailsDTO>> {
    return this.recordReturn(id, request);
  }

  /**
   * Link an issued policy to a project
   * PUT /api/projects/{id}/policy-link?policyNumber={policyNumber}
   */
  linkPolicy(id: number | string, policyNumber: string): Observable<ApiResponse<ProjectDetailsDTO>> {
    const params = new HttpParams().set('policyNumber', policyNumber);
    return this.http.put<ApiResponse<ProjectDetailsDTO>>(`${this.baseUrl}/${id}/policy-link`, {}, { params });
  }
}

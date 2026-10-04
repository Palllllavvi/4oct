package org.example.projectequipmentservice.project.controller;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.projectequipmentservice.common.dto.ApiResponse;
import org.example.projectequipmentservice.common.enums.Role;
import org.example.projectequipmentservice.common.security.UserPrincipal;
import org.example.projectequipmentservice.project.dto.*;
import org.example.projectequipmentservice.project.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProjectRequest request) {

        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }

        ProjectDetailsDTO created =
                projectService.createProject(principal.getId(), request);

        return ResponseEntity.ok(
                ApiResponse.ok("Project created successfully", created));
    }

    @PreAuthorize("hasAnyRole('FREELANCER','ADMIN','UNDERWRITER','ASSESSOR')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDetailsDTO>>> getMyProjects(
            @AuthenticationPrincipal UserPrincipal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }

        List<ProjectDetailsDTO> list = (principal.getRole() == Role.ROLE_ADMIN
                || principal.getRole() == Role.ROLE_UNDERWRITER
                || principal.getRole() == Role.ROLE_ASSESSOR)
                ? projectService.getAllProjects()
                : projectService.getProjectsByUser(principal.getId());

        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PreAuthorize("hasAnyRole('ADMIN','UNDERWRITER','ASSESSOR')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProjectDetailsDTO>>> getAllProjects() {

        List<ProjectDetailsDTO> list =
                projectService.getAllProjects();

        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PreAuthorize("hasAnyRole('ADMIN','UNDERWRITER','ASSESSOR','FREELANCER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> getProjectById(
            @PathVariable Long id) {

        ProjectDetailsDTO dto =
                projectService.getProjectDetails(id);

        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/{id}/agreement")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> uploadAgreement(
            @PathVariable Long id,
            @RequestBody AgreementUploadRequest req) {

        ProjectDetailsDTO updated =
                projectService.uploadAgreement(
                        id,
                        req.getDocumentName(),
                        req.getDocumentText());

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Agreement processed and liability clauses extracted",
                        updated));
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/{id}/equipment")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> addEquipment(
            @PathVariable Long id,
            @Valid @RequestBody AddEquipmentRequest req) {

        ProjectDetailsDTO updated =
                projectService.addEquipment(id, req);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Client equipment registered successfully",
                        updated));
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/{id}/handover")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> recordHandover(
            @PathVariable Long id,
            @Valid @RequestBody HandoverRequest req) {

        req.setProjectId(id);

        ProjectDetailsDTO updated =
                projectService.recordHandover(req);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Handover confirmed and chain of custody recorded",
                        updated));
    }

    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> recordReturn(
            @PathVariable Long id,
            @Valid @RequestBody ReturnEquipmentRequest req) {

        req.setProjectId(id);

        ProjectDetailsDTO updated =
                projectService.recordReturn(req);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Equipment return recorded and project completed",
                        updated));
    }

    @PreAuthorize("hasAnyRole('ADMIN','UNDERWRITER','FREELANCER')")
    @PutMapping("/{id}/policy-link")
    public ResponseEntity<ApiResponse<String>> linkPolicy(
            @PathVariable Long id,
            @RequestParam String policyNumber) {

        projectService.updateProjectPolicy(id, policyNumber);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "Project policy linked successfully",
                        policyNumber));
    }

    @Data
    public static class AgreementUploadRequest {
        private String documentName;
        private String documentText;
    }
}
package org.example.projectequipmentservice.project.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.projectequipmentservice.common.enums.EquipmentCondition;
import org.example.projectequipmentservice.common.enums.ProjectStatus;
import org.example.projectequipmentservice.project.dto.*;
import org.example.projectequipmentservice.project.entity.*;
import org.example.projectequipmentservice.project.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ClientRepository clientRepository;
    private final ProjectAgreementRepository agreementRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentHandoverRepository handoverRepository;
    private final AgreementAnalysisService agreementAnalysisService;

    @Transactional
    public ProjectDetailsDTO createProject(Long userId, CreateProjectRequest req) {
        Client client = clientRepository.findByEmail(req.getClientEmail())
                .orElseGet(() -> clientRepository.save(Client.builder()
                        .name(req.getClientName())
                        .companyName(req.getClientCompanyName())
                        .email(req.getClientEmail())
                        .phone(req.getClientPhone())
                        .build()));

        Project project = Project.builder()
                .userId(userId)
                .client(client)
                .projectName(req.getProjectName())
                .description(req.getDescription())
                .location(req.getLocation())
                .startDate(req.getStartDate())
                .expectedEndDate(req.getExpectedEndDate())
                .status(ProjectStatus.DRAFT)
                .build();

        Project savedProject = projectRepository.save(project);
        return getProjectDetails(savedProject.getId());
    }

    public List<ProjectDetailsDTO> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(p -> getProjectDetails(p.getId()))
                .collect(Collectors.toList());
    }

    public List<ProjectDetailsDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(p -> getProjectDetails(p.getId()))
                .collect(Collectors.toList());
    }

    public ProjectDetailsDTO getProjectDetails(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        ProjectAgreement agreement = agreementRepository.findByProjectId(projectId).orElse(null);
        List<Equipment> equipmentList = equipmentRepository.findByProjectId(projectId);
        List<EquipmentHandover> handovers = handoverRepository.findByProjectId(projectId);

        boolean handoverCompleted = !equipmentList.isEmpty() && handovers.size() >= equipmentList.size() &&
                handovers.stream().allMatch(h -> Boolean.TRUE.equals(h.getClientConfirmation()) && Boolean.TRUE.equals(h.getFreelancerConfirmation()));

        boolean returnCompleted = !handovers.isEmpty() &&
                handovers.stream().allMatch(h -> Boolean.TRUE.equals(h.getReturnConfirmed()));

        LocalDate latestHandoverDate = handovers.stream()
                .map(EquipmentHandover::getHandoverDate)
                .max(LocalDate::compareTo)
                .orElse(null);

        return ProjectDetailsDTO.builder()
                .id(project.getId())
                .userId(project.getUserId())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .location(project.getLocation())
                .startDate(project.getStartDate())
                .expectedEndDate(project.getExpectedEndDate())
                .actualEndDate(project.getActualEndDate())
                .status(project.getStatus())
                .policyNumber(project.getPolicyNumber())
                .createdAt(project.getCreatedAt())
                .client(ProjectDetailsDTO.ClientDTO.builder()
                        .id(project.getClient().getId())
                        .name(project.getClient().getName())
                        .companyName(project.getClient().getCompanyName())
                        .email(project.getClient().getEmail())
                        .phone(project.getClient().getPhone())
                        .build())
                .agreement(agreement != null ? ProjectDetailsDTO.AgreementDTO.builder()
                        .id(agreement.getId())
                        .documentName(agreement.getDocumentName())
                        .clientEquipmentDetected(agreement.getClientEquipmentDetected())
                        .freelancerLiable(agreement.getFreelancerLiable())
                        .liabilityScope(agreement.getLiabilityScope())
                        .extractedLiabilityText(agreement.getExtractedLiabilityText())
                        .reviewStatus(agreement.getReviewStatus())
                        .build() : null)
                .equipmentList(equipmentList.stream().map(eq -> {
                    var h = handovers.stream().filter(item -> item.getEquipment().getId().equals(eq.getId())).findFirst().orElse(null);
                    return ProjectDetailsDTO.EquipmentDTO.builder()
                            .id(eq.getId())
                            .equipmentType(eq.getEquipmentType())
                            .brand(eq.getBrand())
                            .model(eq.getModel())
                            .serialNumber(eq.getSerialNumber())
                            .declaredValue(eq.getDeclaredValue())
                            .condition(eq.getCondition())
                            .ownerName(eq.getOwnerName())
                            .ownershipEvidence(eq.getOwnershipEvidence())
                            .handedOver(h != null && Boolean.TRUE.equals(h.getFreelancerConfirmation()))
                            .returned(h != null && Boolean.TRUE.equals(h.getReturnConfirmed()))
                            .build();
                }).collect(Collectors.toList()))
                .handoverCompleted(handoverCompleted)
                .handoverDate(latestHandoverDate)
                .returnCompleted(returnCompleted)
                .build();
    }

    @Transactional
    public ProjectDetailsDTO uploadAgreement(Long projectId, String documentName, String documentText) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        ProjectAgreement agreement = agreementRepository.findByProjectId(projectId)
                .orElseGet(() -> ProjectAgreement.builder().project(project).build());

        agreement.setDocumentName(documentName != null ? documentName : "Freelance_Equipment_Service_Agreement.pdf");
        agreement.setDocumentText(documentText);

        agreementAnalysisService.analyzeAgreement(agreement);
        agreementRepository.save(agreement);

        return getProjectDetails(projectId);
    }

    @Transactional
    public ProjectDetailsDTO addEquipment(Long projectId, AddEquipmentRequest req) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        Equipment equipment = Equipment.builder()
                .project(project)
                .equipmentType(req.getEquipmentType())
                .brand(req.getBrand())
                .model(req.getModel())
                .serialNumber(req.getSerialNumber())
                .declaredValue(req.getDeclaredValue())
                .condition(req.getCondition() != null ? req.getCondition() : EquipmentCondition.GOOD)
                .ownerName(project.getClient().getCompanyName() != null ? project.getClient().getCompanyName() : project.getClient().getName())
                .ownershipEvidence(req.getOwnershipEvidence() != null ? req.getOwnershipEvidence() : "Client Asset Register Ref #EQ-" + req.getSerialNumber())
                .photoUrl(req.getPhotoUrl())
                .build();

        equipmentRepository.save(equipment);
        return getProjectDetails(projectId);
    }

    @Transactional
    public ProjectDetailsDTO recordHandover(HandoverRequest req) {
        Project project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found: " + req.getProjectId()));

        for (HandoverRequest.HandoverItemDTO item : req.getItems()) {
            Equipment equipment = equipmentRepository.findById(item.getEquipmentId())
                    .orElseThrow(() -> new RuntimeException("Equipment not found: " + item.getEquipmentId()));

            EquipmentHandover handover = handoverRepository.findByProjectIdAndEquipmentId(project.getId(), equipment.getId())
                    .orElseGet(() -> EquipmentHandover.builder()
                            .projectId(project.getId())
                            .equipment(equipment)
                            .build());

            handover.setHandoverDate(req.getHandoverDate());
            handover.setHandoverCondition(item.getCondition() != null ? item.getCondition() : equipment.getCondition());
            handover.setClientConfirmation(Boolean.TRUE.equals(item.getClientConfirmation()));
            handover.setFreelancerConfirmation(Boolean.TRUE.equals(item.getFreelancerConfirmation()));
            handover.setHandoverNotes(item.getNotes());

            handoverRepository.save(handover);
            equipment.setHandoverDate(req.getHandoverDate());
            equipmentRepository.save(equipment);
        }

        if (project.getStatus() == ProjectStatus.DRAFT) {
            project.setStatus(ProjectStatus.QUOTE);
            projectRepository.save(project);
        }

        return getProjectDetails(project.getId());
    }

    @Transactional
    public ProjectDetailsDTO recordReturn(ReturnEquipmentRequest req) {
        Project project = projectRepository.findById(req.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found: " + req.getProjectId()));

        for (ReturnEquipmentRequest.ReturnItemDTO item : req.getItems()) {
            Equipment equipment = equipmentRepository.findById(item.getEquipmentId())
                    .orElseThrow(() -> new RuntimeException("Equipment not found: " + item.getEquipmentId()));

            EquipmentHandover handover = handoverRepository.findByProjectIdAndEquipmentId(project.getId(), equipment.getId())
                    .orElseThrow(() -> new RuntimeException("Handover record not found for equipment: " + equipment.getId()));

            handover.setReturnDate(req.getReturnDate());
            handover.setReturnCondition(item.getReturnCondition() != null ? item.getReturnCondition() : equipment.getCondition());
            handover.setReturnConfirmed(Boolean.TRUE.equals(item.getClientConfirmedReturn()));
            handover.setReturnNotes(item.getReturnNotes());

            handoverRepository.save(handover);
        }

        project.setActualEndDate(req.getReturnDate());
        project.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(project);

        return getProjectDetails(project.getId());
    }

    @Transactional
    public void updateProjectPolicy(Long projectId, String policyNumber) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));
        project.setPolicyNumber(policyNumber);
        project.setStatus(ProjectStatus.INSURED);
        projectRepository.save(project);
    }
}

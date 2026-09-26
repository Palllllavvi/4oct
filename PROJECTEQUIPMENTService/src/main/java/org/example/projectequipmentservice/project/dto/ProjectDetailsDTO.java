package org.example.projectequipmentservice.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projectequipmentservice.common.enums.EquipmentCondition;
import org.example.projectequipmentservice.common.enums.ProjectStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailsDTO {
    private Long id;
    private Long userId;
    private String projectName;
    private String description;
    private String location;
    private LocalDate startDate;
    private LocalDate expectedEndDate;
    private LocalDate actualEndDate;
    private ProjectStatus status;
    private String policyNumber;
    private LocalDateTime createdAt;

    // Client
    private ClientDTO client;

    // Agreement
    private AgreementDTO agreement;

    // Equipment items
    private List<EquipmentDTO> equipmentList;

    // Handover status
    private Boolean handoverCompleted;
    private LocalDate handoverDate;

    // Return status
    private Boolean returnCompleted;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientDTO {
        private Long id;
        private String name;
        private String companyName;
        private String email;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgreementDTO {
        private Long id;
        private String documentName;
        private Boolean clientEquipmentDetected;
        private Boolean freelancerLiable;
        private String liabilityScope;
        private String extractedLiabilityText;
        private String reviewStatus;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipmentDTO {
        private Long id;
        private String equipmentType;
        private String brand;
        private String model;
        private String serialNumber;
        private Double declaredValue;
        private EquipmentCondition condition;
        private String ownerName;
        private String ownershipEvidence;
        private Boolean handedOver;
        private Boolean returned;
    }
}

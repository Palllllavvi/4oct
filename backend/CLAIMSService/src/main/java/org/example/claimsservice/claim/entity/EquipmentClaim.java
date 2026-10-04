package org.example.claimsservice.claim.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.example.claimsservice.common.enums.IncidentType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment_claims")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String claimNumber; // e.g. EC-2026-000001

    @Column(nullable = false)
    private String policyNumber; // references equipment policy

    @Column(nullable = false)
    private Long userId;

    private Long projectId;
    private Long equipmentId;
    private String equipmentName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType incidentType; // THEFT, DAMAGE, LOSS, etc.

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Column(columnDefinition = "TEXT")
    private String incidentDescription;

    private String incidentLocation;

    @Column(nullable = false)
    private Double claimedAmount;

    private Double approvedAmount;

    @Column(nullable = false)
    private String reportingPolice; // YES/NO

    private String policeReportNumber;

    // Document references (comma-separated file paths / URLs)
    @Column(columnDefinition = "TEXT")
    private String documentRefs;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    // Assessor notes
    @Column(columnDefinition = "TEXT")
    private String assessorNotes;

    private String assessorId;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
    private LocalDateTime settledAt;
}

package org.example.claimsservice.claim.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.example.claimsservice.common.enums.TerminationType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "income_claims")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String claimNumber; // e.g. IC-2026-000001

    @Column(nullable = false)
    private String policyNumber; // references income assurance policy

    @Column(nullable = false)
    private Long userId;

    private String freelancerName;
    private String freelancerEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TerminationType terminationType; // CLIENT_INSOLVENCY, CONTRACT_BREACH, MEDICAL_INCAPACITY, etc.

    @Column(nullable = false)
    private LocalDate terminationDate;

    @Column(columnDefinition = "TEXT")
    private String terminationDescription;

    private String contractingClientName;

    // For medical incapacity events
    private String medicalCondition;
    private String treatingPhysician;
    private LocalDate incapacityStartDate;

    @Column(nullable = false)
    private Double monthlyBenefitClaimed;

    @Column(nullable = false)
    private Integer benefitMonthsClaimed;

    private Double totalBenefitClaimed;
    private Double approvedBenefitAmount;

    // Document references (comma-separated)
    @Column(columnDefinition = "TEXT")
    private String documentRefs;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    @Column(columnDefinition = "TEXT")
    private String assessorNotes;

    private String assessorId;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
    private LocalDateTime settledAt;
}

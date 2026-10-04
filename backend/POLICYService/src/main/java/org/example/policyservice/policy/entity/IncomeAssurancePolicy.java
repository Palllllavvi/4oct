package org.example.policyservice.policy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.policyservice.common.enums.PolicyStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "income_assurance_policies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeAssurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String policyNumber; // e.g. IA-2026-000001

    @Column(nullable = false)
    private Long userId;

    private String freelancerName;
    private String freelancerEmail;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate; // annual: startDate + 1 year

    // Monthly income declared at enrolment
    @Column(nullable = false)
    private Double monthlyIncome;

    // Benefit = monthlyIncome * benefitMonths
    @Column(nullable = false)
    private Integer benefitMonths; // 1..6

    @Column(nullable = false)
    private Double totalBenefit;

    @Column(nullable = false)
    private Double annualPremium;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PolicyStatus status = PolicyStatus.ACTIVE;

    // Covered termination types stored as comma-separated string
    private String coveredTerminationTypes; // e.g. "CLIENT_INSOLVENCY,CONTRACT_BREACH,MEDICAL_INCAPACITY"

    // Waiting period in days before claim is eligible
    @Builder.Default
    private Integer waitingPeriodDays = 30;

    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();
}

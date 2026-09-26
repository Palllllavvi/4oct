package org.example.policyservice.policy.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IssueIncomeAssurancePolicyRequest {
    private Long userId;
    private String freelancerName;
    private String freelancerEmail;
    private LocalDate startDate;
    private Double monthlyIncome;
    private Integer benefitMonths;
    private String coveredTerminationTypes; // comma-separated
}

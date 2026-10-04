package org.example.claimsservice.claim.dto;

import lombok.Data;
import org.example.claimsservice.common.enums.TerminationType;

import java.time.LocalDate;

@Data
public class SubmitIncomeClaimRequest {
    private String policyNumber;
    private Long userId;
    private String freelancerName;
    private String freelancerEmail;
    private TerminationType terminationType;
    private LocalDate terminationDate;
    private String terminationDescription;
    private String contractingClientName;
    // Medical incapacity fields
    private String medicalCondition;
    private String treatingPhysician;
    private LocalDate incapacityStartDate;
    // Benefit claim
    private Double monthlyBenefitClaimed;
    private Integer benefitMonthsClaimed;
    private String documentRefs; // comma-separated
}

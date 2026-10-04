package org.example.policyservice.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeQuoteResponse {
    private String quoteId;
    private Long userId;
    private Double monthlyBenefit;
    private Integer benefitPeriodMonths;
    private Double maxPotentialBenefit;
    private LocalDate policyStartDate;
    private LocalDate policyEndDate; // 1 year
    private Double annualBasePremium;
    private Double riskAdjustment;
    private Double taxAmount; // 18% GST
    private Double totalPayable;
    private List<String> coveredEvents;
    private List<String> exclusions;
    private String underwritingNote;
}

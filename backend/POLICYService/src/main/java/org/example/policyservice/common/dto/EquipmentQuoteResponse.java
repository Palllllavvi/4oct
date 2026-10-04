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
public class EquipmentQuoteResponse {
    private String quoteId;
    private Long projectId;
    private Double totalInsuredValue;
    private Long durationDays;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double basePremium;
    private Double riskAdjustment;
    private Double deductibleDiscount;
    private Double netPremium;
    private Double taxAmount; // 18% GST
    private Double totalPayable;
    private List<String> coveredPerils;
    private List<String> termsSummary;
}

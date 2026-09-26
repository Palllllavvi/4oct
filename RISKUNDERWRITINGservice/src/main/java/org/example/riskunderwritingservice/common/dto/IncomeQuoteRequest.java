package org.example.riskunderwritingservice.common.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncomeQuoteRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Average monthly income is required")
    private Double averageMonthlyIncome;

    @NotNull(message = "Requested monthly benefit is required")
    private Double requestedMonthlyBenefit;

    @NotNull(message = "Benefit period in months is required")
    private Integer benefitPeriodMonths; // e.g., 3 or 6 months

    private String profession;
    private Integer experienceYears;
    private List<String> coveredEventTypes;
}

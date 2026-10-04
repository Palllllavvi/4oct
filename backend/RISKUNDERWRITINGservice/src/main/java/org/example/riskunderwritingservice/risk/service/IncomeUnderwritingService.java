package org.example.riskunderwritingservice.risk.service;


import org.example.riskunderwritingservice.common.dto.IncomeQuoteRequest;
import org.example.riskunderwritingservice.common.dto.IncomeQuoteResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class IncomeUnderwritingService {

    public IncomeQuoteResponse calculateIncomeQuote(IncomeQuoteRequest req) {
        double avgMonthlyIncome = req.getAverageMonthlyIncome() != null ? req.getAverageMonthlyIncome() : 80000.0;
        double requestedBenefit = req.getRequestedMonthlyBenefit() != null ? req.getRequestedMonthlyBenefit() : 50000.0;

        // Underwriting Rule: Benefit cannot exceed 70% of verified historical monthly income
        double maxAllowedMonthlyBenefit = Math.round(avgMonthlyIncome * 0.70);
        double monthlyBenefit = Math.min(requestedBenefit, maxAllowedMonthlyBenefit);

        int benefitMonths = req.getBenefitPeriodMonths() != null && req.getBenefitPeriodMonths() == 6 ? 6 : 3;
        double maxPotentialBenefit = monthlyBenefit * benefitMonths;

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusYears(1).minusDays(1);

        // Pricing model:
        // Base rate: 4.8% of Max Potential Benefit annually
        double baseRate = 0.048;
        double annualBasePremium = maxPotentialBenefit * baseRate;

        // Experience adjustment: >3 years experience gives 12% risk discount
        int experience = req.getExperienceYears() != null ? req.getExperienceYears() : 4;
        double riskDiscount = experience >= 3 ? (annualBasePremium * 0.12) : 0.0;

        double netPremium = Math.round((annualBasePremium - riskDiscount) * 100.0) / 100.0;
        double taxAmount = Math.round((netPremium * 0.18) * 100.0) / 100.0; // 18% GST
        double totalPayable = Math.round((netPremium + taxAmount) * 100.0) / 100.0;

        List<String> coveredEvents = List.of(
                "Unexpected client-side termination of an eligible engagement prior to agreed end date.",
                "Client company insolvency or liquidation resulting in abrupt engagement cancellation.",
                "Verified medical incapacity where severe illness or injury prevents the freelancer from performing duties and results in formal termination of an active engagement."
        );

        List<String> exclusions = List.of(
                "Normal contract completion upon reaching agreed deliverables or scheduled end date.",
                "Freelancer voluntary resignation, refusal of available work, or unilateral project abandonment.",
                "Simply having no active projects / gap between freelance assignments (THIS IS NOT GENERAL UNEMPLOYMENT INSURANCE).",
                "Temporary sickness or short recovery periods that do not result in termination of an eligible contract.",
                "Freelancer breach of contract or willful misconduct."
        );

        String note = String.format(
                "Underwriting Approved: Selected monthly benefit ₹%,.0f (%.1f%% of verified ₹%,.0f monthly income) across %d months maximum benefit period.",
                monthlyBenefit, (monthlyBenefit / avgMonthlyIncome) * 100.0, avgMonthlyIncome, benefitMonths
        );

        return IncomeQuoteResponse.builder()
                .quoteId("Q-IA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .userId(req.getUserId())
                .monthlyBenefit(monthlyBenefit)
                .benefitPeriodMonths(benefitMonths)
                .maxPotentialBenefit(maxPotentialBenefit)
                .policyStartDate(startDate)
                .policyEndDate(endDate)
                .annualBasePremium(Math.round(annualBasePremium * 100.0) / 100.0)
                .riskAdjustment(Math.round(-riskDiscount * 100.0) / 100.0)
                .taxAmount(taxAmount)
                .totalPayable(totalPayable)
                .coveredEvents(coveredEvents)
                .exclusions(exclusions)
                .underwritingNote(note)
                .build();
    }
}

package org.example.riskunderwritingservice.risk.service;


import org.example.riskunderwritingservice.common.dto.EquipmentQuoteRequest;
import org.example.riskunderwritingservice.common.dto.EquipmentQuoteResponse;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EquipmentRiskRatingService {

    public EquipmentQuoteResponse calculateEquipmentQuote(EquipmentQuoteRequest req) {
        double totalInsuredValue = 0.0;
        double weightedRiskFactor = 0.0;

        if (req.getEquipmentList() != null && !req.getEquipmentList().isEmpty()) {
            for (EquipmentQuoteRequest.EquipmentItemDTO item : req.getEquipmentList()) {
                double val = item.getDeclaredValue() != null ? item.getDeclaredValue() : 0.0;
                totalInsuredValue += val;

                // Category risk factor: Drone 1.5x, Camera 1.2x, Lens 1.1x, Laptop 1.0x, Default 1.15x
                double catFactor = getCategoryRiskFactor(item.getEquipmentType());
                weightedRiskFactor += (val * catFactor);
            }
        }

        if (totalInsuredValue <= 0) {
            totalInsuredValue = 400000.0; // Default sample
            weightedRiskFactor = totalInsuredValue * 1.25;
        }

        double compositeRiskFactor = weightedRiskFactor / totalInsuredValue;

        // Duration in days
        long durationDays = 10;
        if (req.getStartDate() != null && req.getEndDate() != null) {
            durationDays = ChronoUnit.DAYS.between(req.getStartDate(), req.getEndDate());
            if (durationDays <= 0) durationDays = 1;
        }

        // Daily base rate: 0.035% of value per day
        double dailyBaseRate = 0.00035;
        double basePremium = totalInsuredValue * dailyBaseRate * durationDays;

        // Coverage perils multiplier
        List<String> coverages = req.getCoverages() != null && !req.getCoverages().isEmpty()
                ? req.getCoverages()
                : List.of("ACCIDENTAL_DAMAGE", "THEFT", "FIRE", "WATER_DAMAGE");

        double perilsMultiplier = 1.0 + ((coverages.size() - 1) * 0.08);

        // Deductible discount
        double deductible = req.getDeductibleAmount() != null ? req.getDeductibleAmount() : 5000.0;
        double deductibleDiscount = Math.min(basePremium * 0.15, (deductible / totalInsuredValue) * basePremium * 3.0);

        double riskAdjustment = (basePremium * compositeRiskFactor * perilsMultiplier) - basePremium;
        double netPremium = Math.round((basePremium + riskAdjustment - deductibleDiscount) * 100.0) / 100.0;
        if (netPremium < 500.0) netPremium = 500.0; // Minimum policy premium threshold

        double taxAmount = Math.round((netPremium * 0.18) * 100.0) / 100.0; // 18% GST
        double totalPayable = Math.round((netPremium + taxAmount) * 100.0) / 100.0;

        List<String> terms = new ArrayList<>();
        terms.add("Project-specific custody liability coverage for client-provided equipment.");
        terms.add("Valid strictly between " + req.getStartDate() + " and " + req.getEndDate() + ".");
        terms.add("Digital chain of custody handover verification required prior to incident.");
        terms.add("Standard policy deductible applied: ₹" + (long) deductible + " per eligible claim.");

        return EquipmentQuoteResponse.builder()
                .quoteId("Q-EQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .projectId(req.getProjectId())
                .totalInsuredValue(totalInsuredValue)
                .durationDays(durationDays)
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .basePremium(Math.round(basePremium * 100.0) / 100.0)
                .riskAdjustment(Math.round(riskAdjustment * 100.0) / 100.0)
                .deductibleDiscount(Math.round(deductibleDiscount * 100.0) / 100.0)
                .netPremium(netPremium)
                .taxAmount(taxAmount)
                .totalPayable(totalPayable)
                .coveredPerils(coverages)
                .termsSummary(terms)
                .build();
    }

    private double getCategoryRiskFactor(String type) {
        if (type == null) return 1.15;
        return switch (type.toLowerCase().trim()) {
            case "drone", "uav", "aerial" -> 1.50;
            case "camera", "dslr", "mirrorless" -> 1.20;
            case "lens", "optics" -> 1.10;
            case "laptop", "macbook", "computer" -> 1.00;
            case "lighting", "audio", "mic" -> 1.05;
            default -> 1.15;
        };
    }
}

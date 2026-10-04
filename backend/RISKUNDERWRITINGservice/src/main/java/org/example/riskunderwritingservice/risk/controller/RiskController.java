package org.example.riskunderwritingservice.risk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.riskunderwritingservice.common.dto.*;
import org.example.riskunderwritingservice.risk.service.EquipmentRiskRatingService;
import org.example.riskunderwritingservice.risk.service.IncomeUnderwritingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskController {

    private final EquipmentRiskRatingService equipmentRiskRatingService;
    private final IncomeUnderwritingService incomeUnderwritingService;

    @PreAuthorize("hasAnyRole('ADMIN','UNDERWRITER','FREELANCER')")
    @PostMapping("/equipment-quote")
    public ResponseEntity<ApiResponse<EquipmentQuoteResponse>> getEquipmentQuote(
            @Valid @RequestBody EquipmentQuoteRequest request) {

        EquipmentQuoteResponse response =
                equipmentRiskRatingService.calculateEquipmentQuote(request);

        return ResponseEntity.ok(
                ApiResponse.ok("Equipment quote generated", response));
    }

    @PreAuthorize("hasAnyRole('ADMIN','UNDERWRITER','FREELANCER')")
    @PostMapping("/income-quote")
    public ResponseEntity<ApiResponse<IncomeQuoteResponse>> getIncomeQuote(
            @Valid @RequestBody IncomeQuoteRequest request) {

        IncomeQuoteResponse response =
                incomeUnderwritingService.calculateIncomeQuote(request);

        return ResponseEntity.ok(
                ApiResponse.ok("Income assurance quote generated", response));
    }
}
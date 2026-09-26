package org.example.policyservice.client;

import org.example.policyservice.common.dto.ApiResponse;
import org.example.policyservice.common.dto.EquipmentQuoteRequest;
import org.example.policyservice.common.dto.EquipmentQuoteResponse;
import org.example.policyservice.common.dto.IncomeQuoteRequest;
import org.example.policyservice.common.dto.IncomeQuoteResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "RISKUNDERWRITING-SERVICE")
public interface RiskClient {

    @PostMapping("/api/risk/equipment-quote")
    ApiResponse<EquipmentQuoteResponse> getEquipmentQuote(
            @RequestBody EquipmentQuoteRequest request);

    @PostMapping("/api/risk/income-quote")
    ApiResponse<IncomeQuoteResponse> getIncomeQuote(
            @RequestBody IncomeQuoteRequest request);
}
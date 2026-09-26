package org.example.claimsservice.client;

import org.example.claimsservice.common.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "POLICY-SERVICE")
public interface PolicyClient {

    @GetMapping("/api/policies/equipment/number/{policyNumber}")
    ApiResponse<?> getEquipmentPolicy(
            @PathVariable String policyNumber);

    @GetMapping("/api/policies/income/number/{policyNumber}")
    ApiResponse<?> getIncomePolicy(
            @PathVariable String policyNumber);
}
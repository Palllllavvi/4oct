package org.example.policyservice.policy.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class IssueEquipmentPolicyRequest {
    private Long projectId;
    private Long userId;
    private String projectName;
    private String clientName;
    private String clientCompanyName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double insuredValue;
    private Double deductible;
    private Double premium;
    private List<PolicyItemRequest> items;

    @Data
    public static class PolicyItemRequest {
        private Long equipmentId;
        private String equipmentName;
        private String serialNumber;
        private Double insuredValue;
        private String condition;
    }
}

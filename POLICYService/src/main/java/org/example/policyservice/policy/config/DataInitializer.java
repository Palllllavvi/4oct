package org.example.policyservice.policy.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.policyservice.policy.dto.IssueEquipmentPolicyRequest;
import org.example.policyservice.policy.dto.IssueIncomeAssurancePolicyRequest;
import org.example.policyservice.policy.service.PolicyService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PolicyService policyService;

    @Override
    public void run(String... args) throws Exception {
        log.info("=== Policy Service: Seeding demo data ===");

        // Demo Equipment Policy
        IssueEquipmentPolicyRequest eqReq = new IssueEquipmentPolicyRequest();
        eqReq.setProjectId(1L);
        eqReq.setUserId(2L);
        eqReq.setProjectName("Mobile App Development");
        eqReq.setClientName("Ravi Kumar");
        eqReq.setClientCompanyName("TechCorp Pvt Ltd");
        eqReq.setStartDate(LocalDate.now());
        eqReq.setEndDate(LocalDate.now().plusMonths(3));
        eqReq.setInsuredValue(85000.0);
        eqReq.setPremium(1275.0);
        eqReq.setDeductible(5000.0);

        IssueEquipmentPolicyRequest.PolicyItemRequest item1 = new IssueEquipmentPolicyRequest.PolicyItemRequest();
        item1.setEquipmentId(1L);
        item1.setEquipmentName("MacBook Pro 14\"");
        item1.setSerialNumber("MBP-2024-001");
        item1.setInsuredValue(70000.0);
        item1.setCondition("EXCELLENT");

        IssueEquipmentPolicyRequest.PolicyItemRequest item2 = new IssueEquipmentPolicyRequest.PolicyItemRequest();
        item2.setEquipmentId(2L);
        item2.setEquipmentName("External SSD 1TB");
        item2.setSerialNumber("SSD-2024-002");
        item2.setInsuredValue(15000.0);
        item2.setCondition("GOOD");

        eqReq.setItems(List.of(item1, item2));
        policyService.issueEquipmentPolicy(eqReq);

        // Demo Income Assurance Policy
        IssueIncomeAssurancePolicyRequest iaReq = new IssueIncomeAssurancePolicyRequest();
        iaReq.setUserId(2L);
        iaReq.setFreelancerName("Priya Sharma");
        iaReq.setFreelancerEmail("priya@example.com");
        iaReq.setStartDate(LocalDate.now());
        iaReq.setMonthlyIncome(75000.0);
        iaReq.setBenefitMonths(3);
        iaReq.setAnnualPremium(5400.0);
        iaReq.setCoveredTerminationTypes("CLIENT_INSOLVENCY,CONTRACT_BREACH,MEDICAL_INCAPACITY");
        policyService.issueIncomeAssurancePolicy(iaReq);

        log.info("=== Policy Service: Demo data seeded successfully ===");
    }
}

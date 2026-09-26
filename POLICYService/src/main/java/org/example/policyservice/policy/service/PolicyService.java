package org.example.policyservice.policy.service;


import lombok.RequiredArgsConstructor;
import org.example.policyservice.client.ProjectClient;
import org.example.policyservice.client.RiskClient;
import org.example.policyservice.common.dto.*;
import org.example.policyservice.common.enums.PolicyStatus;
import org.example.policyservice.policy.dto.IssueEquipmentPolicyRequest;
import org.example.policyservice.policy.dto.IssueIncomeAssurancePolicyRequest;
import org.example.policyservice.policy.entity.EquipmentPolicy;
import org.example.policyservice.policy.entity.EquipmentPolicyItem;
import org.example.policyservice.policy.entity.IncomeAssurancePolicy;
import org.example.policyservice.policy.repository.EquipmentPolicyRepository;
import org.example.policyservice.policy.repository.IncomeAssurancePolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PolicyService {

    private final EquipmentPolicyRepository equipmentPolicyRepository;
    private final IncomeAssurancePolicyRepository incomeAssurancePolicyRepository;
    private final RiskClient riskClient;
    private final ProjectClient projectClient;
    private static final AtomicLong eqCounter = new AtomicLong(1000);
    private static final AtomicLong iaCounter = new AtomicLong(1000);

    // ── Equipment Policy ──────────────────────────────────────────────────────

    public EquipmentPolicy issueEquipmentPolicy(IssueEquipmentPolicyRequest req) {
        String policyNumber = "EQ-" + LocalDate.now().getYear() + "-"
                + String.format("%06d", eqCounter.incrementAndGet());

        List<EquipmentPolicyItem> items = req.getItems() == null ? List.of() :
                req.getItems().stream().map(i -> EquipmentPolicyItem.builder()
                        .equipmentId(i.getEquipmentId())
                        .equipmentName(i.getEquipmentName())
                        .serialNumber(i.getSerialNumber())
                        .insuredValue(i.getInsuredValue())
                        .condition(i.getCondition())
                        .build()).collect(Collectors.toList());
        List<EquipmentQuoteRequest.EquipmentItemDTO> equipmentList =
                req.getItems() == null ? List.of() :
                        req.getItems().stream()
                                .map(i ->
                                        EquipmentQuoteRequest.EquipmentItemDTO.builder()
                                                .equipmentType(i.getEquipmentName())
                                                .serialNumber(i.getSerialNumber())
                                                .declaredValue(i.getInsuredValue())
                                                .condition(i.getCondition())
                                                .build())
                                .toList();

        EquipmentQuoteRequest quoteRequest =
                EquipmentQuoteRequest.builder()
                        .projectId(req.getProjectId())
                        .equipmentList(equipmentList)
                        .startDate(req.getStartDate())
                        .endDate(req.getEndDate())
                        .deductibleAmount(req.getDeductible())
                        .build();

        ApiResponse<EquipmentQuoteResponse> quoteResponse =
                riskClient.getEquipmentQuote(quoteRequest);

        if (quoteResponse == null || quoteResponse.getData() == null) {
            throw new RuntimeException("Unable to generate equipment quote");
        }

        Double calculatedPremium =
                quoteResponse.getData().getTotalPayable();
        EquipmentPolicy policy = EquipmentPolicy.builder()
                .policyNumber(policyNumber)
                .projectId(req.getProjectId())
                .userId(req.getUserId())
                .projectName(req.getProjectName())
                .clientName(req.getClientName())
                .clientCompanyName(req.getClientCompanyName())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .insuredValue(req.getInsuredValue())
                .premium(calculatedPremium)
                .deductible(req.getDeductible() != null ? req.getDeductible() : 0.0)
                .status(PolicyStatus.ACTIVE)
                .issuedAt(LocalDateTime.now())
                .build();

        EquipmentPolicy saved = equipmentPolicyRepository.save(policy);

        for (EquipmentPolicyItem item : items) {
            item.setEquipmentPolicy(saved);
        }

        saved.getItems().addAll(items);

        saved = equipmentPolicyRepository.save(saved);

        try {
            projectClient.linkPolicy(
                    saved.getProjectId(),
                    saved.getPolicyNumber());
        } catch (Exception ex) {
            System.out.println(
                    "Project linking failed: "
                            + ex.getMessage());
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<EquipmentPolicy> getAllEquipmentPolicies() {
        return equipmentPolicyRepository.findAllByOrderByIssuedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<EquipmentPolicy> getEquipmentPoliciesForUser(Long userId) {
        return equipmentPolicyRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<EquipmentPolicy> getEquipmentPolicyById(Long id) {
        return equipmentPolicyRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<EquipmentPolicy> getEquipmentPolicyByNumber(String policyNumber) {
        return equipmentPolicyRepository.findByPolicyNumber(policyNumber);
    }

    public EquipmentPolicy cancelEquipmentPolicy(Long id) {
        EquipmentPolicy policy = equipmentPolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment policy not found: " + id));
        policy.setStatus(PolicyStatus.CANCELLED);
        return equipmentPolicyRepository.save(policy);
    }

    // ── Income Assurance Policy ───────────────────────────────────────────────

    public IncomeAssurancePolicy issueIncomeAssurancePolicy(IssueIncomeAssurancePolicyRequest req) {
        IncomeQuoteRequest quoteRequest =
                IncomeQuoteRequest.builder()
                        .userId(req.getUserId())
                        .averageMonthlyIncome(req.getMonthlyIncome())
                        .requestedMonthlyBenefit(req.getMonthlyIncome())
                        .benefitPeriodMonths(req.getBenefitMonths())
                        .build();

        ApiResponse<IncomeQuoteResponse> quoteResponse =
                riskClient.getIncomeQuote(quoteRequest);

        if (quoteResponse == null || quoteResponse.getData() == null) {
            throw new RuntimeException("Unable to generate income quote");
        }

        Double calculatedPremium =
                quoteResponse.getData().getTotalPayable();

        String policyNumber = "IA-" + LocalDate.now().getYear() + "-"
                + String.format("%06d", iaCounter.incrementAndGet());

        LocalDate startDate = req.getStartDate() != null ? req.getStartDate() : LocalDate.now();
        LocalDate endDate = startDate.plusYears(1);
        double totalBenefit = req.getMonthlyIncome() * req.getBenefitMonths();
        String coveredTypes = req.getCoveredTerminationTypes() != null
                ? req.getCoveredTerminationTypes()
                : "CLIENT_INSOLVENCY,CONTRACT_BREACH,MEDICAL_INCAPACITY";

        IncomeAssurancePolicy policy = IncomeAssurancePolicy.builder()
                .policyNumber(policyNumber)
                .userId(req.getUserId())
                .freelancerName(req.getFreelancerName())
                .freelancerEmail(req.getFreelancerEmail())
                .startDate(startDate)
                .endDate(endDate)
                .monthlyIncome(req.getMonthlyIncome())
                .benefitMonths(req.getBenefitMonths())
                .totalBenefit(totalBenefit)
                .annualPremium(calculatedPremium)
                .status(PolicyStatus.ACTIVE)
                .coveredTerminationTypes(coveredTypes)
                .waitingPeriodDays(30)
                .issuedAt(LocalDateTime.now())
                .build();

        return incomeAssurancePolicyRepository.save(policy);
    }

    @Transactional(readOnly = true)
    public List<IncomeAssurancePolicy> getAllIncomePolicies() {
        return incomeAssurancePolicyRepository.findAllByOrderByIssuedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<IncomeAssurancePolicy> getIncomePoliciesForUser(Long userId) {
        return incomeAssurancePolicyRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<IncomeAssurancePolicy> getIncomePolicyById(Long id) {
        return incomeAssurancePolicyRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<IncomeAssurancePolicy> getIncomePolicyByNumber(String policyNumber) {
        return incomeAssurancePolicyRepository.findByPolicyNumber(policyNumber);
    }

    public IncomeAssurancePolicy cancelIncomePolicy(Long id) {
        IncomeAssurancePolicy policy = incomeAssurancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income assurance policy not found: " + id));
        policy.setStatus(PolicyStatus.CANCELLED);
        return incomeAssurancePolicyRepository.save(policy);
    }
}

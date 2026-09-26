package org.example.claimsservice.claim.service;


import lombok.RequiredArgsConstructor;
import org.example.claimsservice.claim.dto.ReviewClaimRequest;
import org.example.claimsservice.claim.dto.SubmitEquipmentClaimRequest;
import org.example.claimsservice.claim.dto.SubmitIncomeClaimRequest;
import org.example.claimsservice.claim.entity.EquipmentClaim;
import org.example.claimsservice.claim.entity.IncomeClaim;
import org.example.claimsservice.claim.repository.EquipmentClaimRepository;
import org.example.claimsservice.claim.repository.IncomeClaimRepository;
import org.example.claimsservice.client.PolicyClient;
import org.example.claimsservice.common.dto.ApiResponse;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Transactional
public class ClaimService {

    private final EquipmentClaimRepository equipmentClaimRepository;
    private final IncomeClaimRepository incomeClaimRepository;
    private final PolicyClient policyClient;
    private static final AtomicLong ecCounter = new AtomicLong(1000);
    private static final AtomicLong icCounter = new AtomicLong(1000);

    // ── Equipment Claims ──────────────────────────────────────────────────────

    public EquipmentClaim submitEquipmentClaim(SubmitEquipmentClaimRequest req) {

        ApiResponse<?> policyResponse =
                policyClient.getEquipmentPolicy(
                        req.getPolicyNumber());

        if (policyResponse == null || policyResponse.getData() == null) {
            throw new RuntimeException(
                    "Equipment policy not found: "
                            + req.getPolicyNumber());
        }

        String claimNumber = "EC-" + LocalDate.now().getYear() + "-"
                + String.format("%06d", ecCounter.incrementAndGet());

        EquipmentClaim claim = EquipmentClaim.builder()
                .claimNumber(claimNumber)
                .policyNumber(req.getPolicyNumber())
                .userId(req.getUserId())
                .projectId(req.getProjectId())
                .equipmentId(req.getEquipmentId())
                .equipmentName(req.getEquipmentName())
                .incidentType(req.getIncidentType())
                .incidentDate(req.getIncidentDate())
                .incidentDescription(req.getIncidentDescription())
                .incidentLocation(req.getIncidentLocation())
                .claimedAmount(req.getClaimedAmount())
                .reportingPolice(req.getReportingPolice())
                .policeReportNumber(req.getPoliceReportNumber())
                .documentRefs(req.getDocumentRefs())
                .status(ClaimStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        return equipmentClaimRepository.save(claim);
    }

    @Transactional(readOnly = true)
    public List<EquipmentClaim> getAllEquipmentClaims() {
        return equipmentClaimRepository.findAllByOrderBySubmittedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<EquipmentClaim> getEquipmentClaimsForUser(Long userId) {
        return equipmentClaimRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<EquipmentClaim> getEquipmentClaimById(Long id) {
        return equipmentClaimRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<EquipmentClaim> getEquipmentClaimsByStatus(ClaimStatus status) {
        return equipmentClaimRepository.findByStatus(status);
    }

    public EquipmentClaim reviewEquipmentClaim(Long id, ReviewClaimRequest req) {
        EquipmentClaim claim = equipmentClaimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment claim not found: " + id));

        claim.setStatus(req.getStatus());
        claim.setAssessorNotes(req.getAssessorNotes());
        claim.setAssessorId(req.getAssessorId());
        if (req.getApprovedAmount() != null) {
            claim.setApprovedAmount(req.getApprovedAmount());
        }
        claim.setReviewedAt(LocalDateTime.now());
        if (req.getStatus() == ClaimStatus.SETTLED) {
            claim.setSettledAt(LocalDateTime.now());
        }
        return equipmentClaimRepository.save(claim);
    }

    // ── Income Claims ─────────────────────────────────────────────────────────

    public IncomeClaim submitIncomeClaim(SubmitIncomeClaimRequest req) {

        ApiResponse<?> policyResponse =
                policyClient.getIncomePolicy(
                        req.getPolicyNumber());

        if (policyResponse == null || policyResponse.getData() == null) {
            throw new RuntimeException(
                    "Income policy not found: "
                            + req.getPolicyNumber());
        }

        String claimNumber = "IC-" + LocalDate.now().getYear() + "-"
                + String.format("%06d", icCounter.incrementAndGet());

        double totalBenefit = req.getMonthlyBenefitClaimed() * req.getBenefitMonthsClaimed();

        IncomeClaim claim = IncomeClaim.builder()
                .claimNumber(claimNumber)
                .policyNumber(req.getPolicyNumber())
                .userId(req.getUserId())
                .freelancerName(req.getFreelancerName())
                .freelancerEmail(req.getFreelancerEmail())
                .terminationType(req.getTerminationType())
                .terminationDate(req.getTerminationDate())
                .terminationDescription(req.getTerminationDescription())
                .contractingClientName(req.getContractingClientName())
                .medicalCondition(req.getMedicalCondition())
                .treatingPhysician(req.getTreatingPhysician())
                .incapacityStartDate(req.getIncapacityStartDate())
                .monthlyBenefitClaimed(req.getMonthlyBenefitClaimed())
                .benefitMonthsClaimed(req.getBenefitMonthsClaimed())
                .totalBenefitClaimed(totalBenefit)
                .documentRefs(req.getDocumentRefs())
                .status(ClaimStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        return incomeClaimRepository.save(claim);
    }

    @Transactional(readOnly = true)
    public List<IncomeClaim> getAllIncomeClaims() {
        return incomeClaimRepository.findAllByOrderBySubmittedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<IncomeClaim> getIncomeClaimsForUser(Long userId) {
        return incomeClaimRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<IncomeClaim> getIncomeClaimById(Long id) {
        return incomeClaimRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<IncomeClaim> getIncomeClaimsByStatus(ClaimStatus status) {
        return incomeClaimRepository.findByStatus(status);
    }

    public IncomeClaim reviewIncomeClaim(Long id, ReviewClaimRequest req) {
        IncomeClaim claim = incomeClaimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income claim not found: " + id));

        claim.setStatus(req.getStatus());
        claim.setAssessorNotes(req.getAssessorNotes());
        claim.setAssessorId(req.getAssessorId());
        if (req.getApprovedAmount() != null) {
            claim.setApprovedBenefitAmount(req.getApprovedAmount());
        }
        claim.setReviewedAt(LocalDateTime.now());
        if (req.getStatus() == ClaimStatus.SETTLED) {
            claim.setSettledAt(LocalDateTime.now());
        }
        return incomeClaimRepository.save(claim);
    }
}

package org.example.claimsservice.claim.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.claimsservice.claim.dto.ReviewClaimRequest;
import org.example.claimsservice.claim.dto.SubmitEquipmentClaimRequest;
import org.example.claimsservice.claim.dto.SubmitIncomeClaimRequest;
import org.example.claimsservice.claim.entity.EquipmentClaim;
import org.example.claimsservice.claim.service.ClaimService;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.example.claimsservice.common.enums.IncidentType;
import org.example.claimsservice.common.enums.TerminationType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ClaimService claimService;

    @Override
    public void run(String... args) throws Exception {
        log.info("=== Claim Service: Seeding demo data ===");

        // Equipment claim - submitted
        SubmitEquipmentClaimRequest eqReq = new SubmitEquipmentClaimRequest();
        eqReq.setPolicyNumber("EQ-2026-001001");
        eqReq.setUserId(2L);
        eqReq.setProjectId(1L);
        eqReq.setEquipmentId(1L);
        eqReq.setEquipmentName("MacBook Pro 14\"");
        eqReq.setIncidentType(IncidentType.PHYSICAL_DAMAGE);
        eqReq.setIncidentDate(LocalDate.now().minusDays(5));
        eqReq.setIncidentDescription("Laptop dropped accidentally during client site visit. Screen cracked and internal components damaged.");
        eqReq.setIncidentLocation("Client Office, Bengaluru");
        eqReq.setClaimedAmount(45000.0);
        eqReq.setReportingPolice("NO");
        eqReq.setDocumentRefs("repair_quote.pdf,incident_photos.zip");
        EquipmentClaim ec = claimService.submitEquipmentClaim(eqReq);

        // Move to UNDER_REVIEW
        ReviewClaimRequest review = new ReviewClaimRequest();
        review.setStatus(ClaimStatus.UNDER_REVIEW);
        review.setAssessorNotes("Initial documents verified. Repair estimate pending 3rd-party assessment.");
        review.setAssessorId("assessor-001");
        claimService.reviewEquipmentClaim(ec.getId(), review);

        // Income claim - submitted
        SubmitIncomeClaimRequest icReq = new SubmitIncomeClaimRequest();
        icReq.setPolicyNumber("IA-2026-001001");
        icReq.setUserId(2L);
        icReq.setFreelancerName("Priya Sharma");
        icReq.setFreelancerEmail("priya@example.com");
        icReq.setTerminationType(TerminationType.MEDICAL_INCAPACITY);
        icReq.setTerminationDate(LocalDate.now().minusDays(15));
        icReq.setTerminationDescription("Diagnosed with fracture requiring 2-month recovery. Unable to continue contracted development work.");
        icReq.setContractingClientName("TechCorp Pvt Ltd");
        icReq.setMedicalCondition("Hairline fracture - right wrist");
        icReq.setTreatingPhysician("Dr. Anjali Mehta, Apollo Hospital");
        icReq.setIncapacityStartDate(LocalDate.now().minusDays(15));
        icReq.setMonthlyBenefitClaimed(75000.0);
        icReq.setBenefitMonthsClaimed(2);
        icReq.setDocumentRefs("medical_certificate.pdf,doctor_prescription.pdf,termination_letter.pdf");
        claimService.submitIncomeClaim(icReq);

        log.info("=== Claim Service: Demo data seeded successfully ===");
    }
}

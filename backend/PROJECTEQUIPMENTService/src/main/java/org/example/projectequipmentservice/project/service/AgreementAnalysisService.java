package org.example.projectequipmentservice.project.service;

import lombok.extern.slf4j.Slf4j;
import org.example.projectequipmentservice.project.entity.ProjectAgreement;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AgreementAnalysisService {

    private static final Pattern EQUIPMENT_PATTERN = Pattern.compile(
            "(?i)(client[- ]provided equipment|client will provide|equipment provided by client|gear provided|borrowed equipment|tools provided by company|equipment listed in schedule)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern LIABILITY_PATTERN = Pattern.compile(
            "(?i)(contractor shall be (solely )?responsible|freelancer (shall be|is) liable|liable for (any )?(loss|damage|theft)|responsible for the safe custody|duty of care|reimburse client for damage|assume liability for equipment)",
            Pattern.CASE_INSENSITIVE
    );

    public void analyzeAgreement(ProjectAgreement agreement) {
        String text = agreement.getDocumentText();
        if (text == null || text.isBlank()) {
            agreement.setClientEquipmentDetected(false);
            agreement.setFreelancerLiable(false);
            agreement.setReviewStatus("FLAGGED_FOR_UNDERWRITING");
            agreement.setExtractedLiabilityText("No agreement text provided for automated clause extraction.");
            return;
        }

        boolean equipmentDetected = EQUIPMENT_PATTERN.matcher(text).find()
                || text.toLowerCase().contains("equipment")
                || text.toLowerCase().contains("camera")
                || text.toLowerCase().contains("drone");

        boolean liabilityDetected = LIABILITY_PATTERN.matcher(text).find()
                || text.toLowerCase().contains("responsible for loss or damage")
                || text.toLowerCase().contains("liable");

        agreement.setClientEquipmentDetected(equipmentDetected);
        agreement.setFreelancerLiable(liabilityDetected);

        // Extract snippet
        StringBuilder extracted = new StringBuilder();
        Matcher matcher = LIABILITY_PATTERN.matcher(text);
        if (matcher.find()) {
            int start = Math.max(0, matcher.start() - 50);
            int end = Math.min(text.length(), matcher.end() + 150);
            extracted.append("...").append(text.substring(start, end).trim()).append("...");
        } else if (liabilityDetected) {
            extracted.append("Clause identified: Freelancer holds contractual custody and liability for equipment during engagement period.");
        } else {
            extracted.append("No explicit equipment liability clause detected. Human underwriting review required.");
        }

        agreement.setExtractedLiabilityText(extracted.toString());

        if (equipmentDetected && liabilityDetected) {
            agreement.setLiabilityScope("Loss / Physical Damage / Theft");
            agreement.setReviewStatus("VERIFIED");
        } else if (equipmentDetected) {
            agreement.setReviewStatus("FLAGGED_FOR_UNDERWRITING");
        } else {
            agreement.setReviewStatus("REJECTED");
        }

        log.info("Agreement analyzed for project id: {}, equipmentDetected: {}, liabilityDetected: {}, status: {}",
                agreement.getProject() != null ? agreement.getProject().getId() : null,
                equipmentDetected, liabilityDetected, agreement.getReviewStatus());
    }
}

package org.example.claimsservice.claim.dto;

import lombok.Data;
import org.example.claimsservice.common.enums.ClaimStatus;

@Data
public class ReviewClaimRequest {
    private ClaimStatus status; // UNDER_REVIEW, APPROVED, REJECTED, SETTLED
    private String assessorNotes;
    private String assessorId;
    private Double approvedAmount; // for APPROVED/SETTLED
}

package org.example.claimsservice.claim.controller;


import lombok.RequiredArgsConstructor;
import org.example.claimsservice.claim.dto.ReviewClaimRequest;
import org.example.claimsservice.claim.dto.SubmitEquipmentClaimRequest;
import org.example.claimsservice.claim.dto.SubmitIncomeClaimRequest;
import org.example.claimsservice.claim.entity.EquipmentClaim;
import org.example.claimsservice.claim.entity.IncomeClaim;
import org.example.claimsservice.claim.service.ClaimService;
import org.example.claimsservice.common.dto.ApiResponse;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.example.claimsservice.common.enums.Role;
import org.example.claimsservice.common.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    // ── Equipment Claims ──────────────────────────────────────────────────────
    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/equipment")
    public ResponseEntity<ApiResponse<EquipmentClaim>> submitEquipmentClaim(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody SubmitEquipmentClaimRequest request) {
        if (principal != null) {
            request.setUserId(principal.getId());
        }
        EquipmentClaim claim = claimService.submitEquipmentClaim(request);
        return ResponseEntity.ok(ApiResponse.ok("Equipment claim submitted: " + claim.getClaimNumber(), claim));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR','FREELANCER')")
    @GetMapping("/equipment")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getAllEquipmentClaims(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null && principal.getRole() == Role.ROLE_FREELANCER) {
            return ResponseEntity.ok(ApiResponse.ok("User equipment claims", claimService.getEquipmentClaimsForUser(principal.getId())));
        }
        return ResponseEntity.ok(ApiResponse.ok("All equipment claims", claimService.getAllEquipmentClaims()));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR') or (hasRole('FREELANCER') and #userId == principal.id)")
    @GetMapping("/equipment/user/{userId}")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getEquipmentClaimsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User equipment claims", claimService.getEquipmentClaimsForUser(userId)));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR','FREELANCER')")
    @GetMapping("/equipment/{id}")
    public ResponseEntity<ApiResponse<EquipmentClaim>> getEquipmentClaimById(@PathVariable Long id) {
        return claimService.getEquipmentClaimById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.<EquipmentClaim>ok("Claim found", c)))
                .orElse(ResponseEntity.notFound().build());
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR','FREELANCER')")
    @GetMapping("/equipment/status/{status}")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getEquipmentClaimsByStatus(@PathVariable ClaimStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Claims by status", claimService.getEquipmentClaimsByStatus(status)));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR')")
    @PatchMapping("/equipment/{id}/review")
    public ResponseEntity<ApiResponse<EquipmentClaim>> reviewEquipmentClaim(
            @PathVariable Long id, @RequestBody ReviewClaimRequest request) {
        EquipmentClaim reviewed = claimService.reviewEquipmentClaim(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Claim reviewed", reviewed));
    }

    // ── Income Claims ─────────────────────────────────────────────────────────
    @PreAuthorize("hasRole('FREELANCER')")
    @PostMapping("/income")
    public ResponseEntity<ApiResponse<IncomeClaim>> submitIncomeClaim(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody SubmitIncomeClaimRequest request) {
        if (principal != null) {
            request.setUserId(principal.getId());
            if (request.getFreelancerEmail() == null || request.getFreelancerEmail().isBlank()) {
                request.setFreelancerEmail(principal.getEmail());
            }
        }
        IncomeClaim claim = claimService.submitIncomeClaim(request);
        return ResponseEntity.ok(ApiResponse.ok("Income claim submitted: " + claim.getClaimNumber(), claim));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR','FREELANCER')")
    @GetMapping("/income")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getAllIncomeClaims(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null && principal.getRole() == Role.ROLE_FREELANCER) {
            return ResponseEntity.ok(ApiResponse.ok("User income claims", claimService.getIncomeClaimsForUser(principal.getId())));
        }
        return ResponseEntity.ok(ApiResponse.ok("All income claims", claimService.getAllIncomeClaims()));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR') or (hasRole('FREELANCER') and #userId == principal.id)")
    @GetMapping("/income/user/{userId}")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getIncomeClaimsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User income claims", claimService.getIncomeClaimsForUser(userId)));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR','FREELANCER')")
    @GetMapping("/income/{id}")
    public ResponseEntity<ApiResponse<IncomeClaim>> getIncomeClaimById(@PathVariable Long id) {
        return claimService.getIncomeClaimById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.<IncomeClaim>ok("Claim found", c)))
                .orElse(ResponseEntity.notFound().build());
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR')")
    @GetMapping("/income/status/{status}")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getIncomeClaimsByStatus(@PathVariable ClaimStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Claims by status", claimService.getIncomeClaimsByStatus(status)));
    }
    @PreAuthorize("hasAnyRole('ADMIN','ASSESSOR')")
    @PatchMapping("/income/{id}/review")
    public ResponseEntity<ApiResponse<IncomeClaim>> reviewIncomeClaim(
            @PathVariable Long id, @RequestBody ReviewClaimRequest request) {
        IncomeClaim reviewed = claimService.reviewIncomeClaim(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Claim reviewed", reviewed));
    }
}

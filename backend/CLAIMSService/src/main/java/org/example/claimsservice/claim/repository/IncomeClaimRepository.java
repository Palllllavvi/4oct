package org.example.claimsservice.claim.repository;


import org.example.claimsservice.claim.entity.IncomeClaim;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeClaimRepository extends JpaRepository<IncomeClaim, Long> {
    List<IncomeClaim> findByUserId(Long userId);
    List<IncomeClaim> findByPolicyNumber(String policyNumber);
    List<IncomeClaim> findByStatus(ClaimStatus status);
    Optional<IncomeClaim> findByClaimNumber(String claimNumber);
    List<IncomeClaim> findAllByOrderBySubmittedAtDesc();
}

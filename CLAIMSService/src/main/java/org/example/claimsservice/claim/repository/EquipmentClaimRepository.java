package org.example.claimsservice.claim.repository;


import org.example.claimsservice.claim.entity.EquipmentClaim;
import org.example.claimsservice.common.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentClaimRepository extends JpaRepository<EquipmentClaim, Long> {
    List<EquipmentClaim> findByUserId(Long userId);
    List<EquipmentClaim> findByPolicyNumber(String policyNumber);
    List<EquipmentClaim> findByStatus(ClaimStatus status);
    Optional<EquipmentClaim> findByClaimNumber(String claimNumber);
    List<EquipmentClaim> findAllByOrderBySubmittedAtDesc();
}

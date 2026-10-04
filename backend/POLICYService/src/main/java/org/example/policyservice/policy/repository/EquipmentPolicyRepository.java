package org.example.policyservice.policy.repository;

import org.example.policyservice.policy.entity.EquipmentPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentPolicyRepository extends JpaRepository<EquipmentPolicy, Long> {
    List<EquipmentPolicy> findByUserId(Long userId);
    Optional<EquipmentPolicy> findByProjectId(Long projectId);
    Optional<EquipmentPolicy> findByPolicyNumber(String policyNumber);
    List<EquipmentPolicy> findAllByOrderByIssuedAtDesc();
}

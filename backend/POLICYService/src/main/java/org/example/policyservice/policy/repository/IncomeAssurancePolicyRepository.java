package org.example.policyservice.policy.repository;

import org.example.policyservice.policy.entity.IncomeAssurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeAssurancePolicyRepository extends JpaRepository<IncomeAssurancePolicy, Long> {
    List<IncomeAssurancePolicy> findByUserId(Long userId);
    Optional<IncomeAssurancePolicy> findByPolicyNumber(String policyNumber);
    List<IncomeAssurancePolicy> findAllByOrderByIssuedAtDesc();
}

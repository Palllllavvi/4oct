package org.example.policyservice.policy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.policyservice.common.enums.PolicyStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipment_policies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String policyNumber; // e.g. EQ-2026-000124

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private Long userId;

    private String projectName;
    private String clientName;
    private String clientCompanyName;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private Double insuredValue;

    @Column(nullable = false)
    private Double premium;

    private Double deductible;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PolicyStatus status = PolicyStatus.ACTIVE;

    @OneToMany(mappedBy = "equipmentPolicy", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<EquipmentPolicyItem> items = new ArrayList<>();

    @Builder.Default
    private LocalDateTime issuedAt = LocalDateTime.now();
}

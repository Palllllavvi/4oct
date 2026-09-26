package org.example.policyservice.policy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipment_policy_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentPolicyItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_policy_id", nullable = false)
    private EquipmentPolicy equipmentPolicy;

    private Long equipmentId;
    private String equipmentName;
    private String serialNumber;
    private Double insuredValue;
    private String condition; // EXCELLENT, GOOD, FAIR
}

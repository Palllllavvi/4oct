package org.example.projectequipmentservice.project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projectequipmentservice.common.enums.EquipmentCondition;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String equipmentType; // Camera, Lens, Drone, Laptop, Audio, etc.

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private Double declaredValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EquipmentCondition condition = EquipmentCondition.GOOD;

    @Column(nullable = false)
    private String ownerName; // Client's name / company confirming ownership

    private String ownershipEvidence; // Invoice ref, receipt, serial cert

    private String photoUrl;

    private LocalDate handoverDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

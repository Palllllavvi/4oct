package org.example.projectequipmentservice.project.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_agreements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAgreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    private Project project;

    private String documentName;

    @Column(length = 10000)
    private String documentText;

    @Builder.Default
    private Boolean clientEquipmentDetected = false;

    @Builder.Default
    private Boolean freelancerLiable = false;

    private String liabilityScope; // e.g. "Loss / Physical Damage / Theft"

    @Column(length = 2000)
    private String extractedLiabilityText;

    private String reviewStatus; // VERIFIED, FLAGGED_FOR_UNDERWRITING, REJECTED

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}

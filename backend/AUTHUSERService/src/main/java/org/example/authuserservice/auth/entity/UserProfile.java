package org.example.authuserservice.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    private String profession;
    private Integer experienceYears;
    private String city;
    private String address;
    private Double averageMonthlyIncome;

    @Builder.Default
    private Boolean kycVerified = false;
    private String kycDocumentType; // PAN, AADHAAR, PASSPORT
    private String kycDocumentNumber;
    private LocalDateTime kycVerifiedAt;
}

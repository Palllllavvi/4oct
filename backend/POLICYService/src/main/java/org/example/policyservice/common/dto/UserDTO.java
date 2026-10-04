package org.example.policyservice.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.policyservice.common.enums.Role;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profession;
    private Integer experienceYears;
    private String city;
    private Double averageMonthlyIncome;
    private Role role;
    private Boolean kycVerified;
    private LocalDateTime createdAt;
}

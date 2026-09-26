package org.example.projectequipmentservice.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank(message = "Project name is required")
    private String projectName;

    private String description;
    private String location;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Expected end date is required")
    private LocalDate expectedEndDate;

    // Client information
    @NotBlank(message = "Client name is required")
    private String clientName;

    private String clientCompanyName;

    @NotBlank(message = "Client email is required")
    private String clientEmail;

    private String clientPhone;
}

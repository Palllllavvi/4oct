package org.example.projectequipmentservice.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.projectequipmentservice.common.enums.EquipmentCondition;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HandoverRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Handover date is required")
    private LocalDate handoverDate;

    private List<HandoverItemDTO> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HandoverItemDTO {
        private Long equipmentId;
        private EquipmentCondition condition;
        private Boolean clientConfirmation;
        private Boolean freelancerConfirmation;
        private String notes;
    }
}

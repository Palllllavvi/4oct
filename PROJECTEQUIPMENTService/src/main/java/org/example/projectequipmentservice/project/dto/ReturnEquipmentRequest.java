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
public class ReturnEquipmentRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Return date is required")
    private LocalDate returnDate;

    private List<ReturnItemDTO> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReturnItemDTO {
        private Long equipmentId;
        private EquipmentCondition returnCondition;
        private Boolean clientConfirmedReturn;
        private String returnNotes;
    }
}

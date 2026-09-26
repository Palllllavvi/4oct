package org.example.projectequipmentservice.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentQuoteRequest {
    private Long projectId;
    private List<EquipmentItemDTO> equipmentList;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private List<String> coverages; // ACCIDENTAL_DAMAGE, THEFT, FIRE, WATER_DAMAGE, NATURAL_EVENT
    private Double deductibleAmount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipmentItemDTO {
        private String equipmentType;
        private String brand;
        private String model;
        private String serialNumber;
        private Double declaredValue;
        private String condition;
    }
}

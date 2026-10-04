package org.example.projectequipmentservice.project.repository;

import org.example.projectequipmentservice.project.entity.EquipmentHandover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentHandoverRepository extends JpaRepository<EquipmentHandover, Long> {
    List<EquipmentHandover> findByProjectId(Long projectId);
    Optional<EquipmentHandover> findByProjectIdAndEquipmentId(Long projectId, Long equipmentId);
}

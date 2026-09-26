package org.example.projectequipmentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.example.projectequipmentservice")
public class ProjectEquipmentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectEquipmentServiceApplication.class, args);
    }
}
package org.example.projectequipmentservice.project.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.projectequipmentservice.common.enums.EquipmentCondition;
import org.example.projectequipmentservice.common.enums.ProjectStatus;
import org.example.projectequipmentservice.project.entity.*;
import org.example.projectequipmentservice.project.repository.*;
import org.example.projectequipmentservice.project.service.AgreementAnalysisService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final ProjectAgreementRepository agreementRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentHandoverRepository handoverRepository;
    private final AgreementAnalysisService agreementAnalysisService;

    @Override
    public void run(String... args) {
        if (projectRepository.count() == 0) {
            log.info("Seeding initial Client, Project, Agreement, Equipment, and Handover data...");

            // 1. Client ABC Events
            Client client = Client.builder()
                    .name("Vikram Mehta")
                    .companyName("ABC Events Pvt Ltd")
                    .email("contact@abcevents.in")
                    .phone("+91-9848012345")
                    .address("Hitech City, Hyderabad, Telangana")
                    .build();
            Client savedClient = clientRepository.save(client);

            // 2. Project
            Project project = Project.builder()
                    .userId(1L) // Rahul Kumar
                    .client(savedClient)
                    .projectName("Wedding Photography")
                    .description("Grand Destination Wedding photography and 4K aerial videography coverage at Taj Falaknuma.")
                    .location("Hyderabad")
                    .startDate(LocalDate.of(2026, 10, 10))
                    .expectedEndDate(LocalDate.of(2026, 10, 20))
                    .status(ProjectStatus.QUOTE)
                    .build();
            Project savedProject = projectRepository.save(project);

            // 3. Agreement with contractual liability
            String agreementText = """
                    MASTER FREELANCE CONTRACTOR AGREEMENT
                    BETWEEN: ABC Events Pvt Ltd ("Client")
                    AND: Rahul Kumar ("Contractor / Freelancer")
                    PROJECT: Wedding Photography (10-Oct-2026 to 20-Oct-2026)
                    
                    SECTION 4: CLIENT-PROVIDED EQUIPMENT & CUSTODY
                    The Client shall provide professional camera and aerial drone equipment to the Contractor solely for the duration and purpose of the Wedding Photography project.
                    The equipment belongs exclusively to the Client and is provided on a temporary loan basis.
                    
                    SECTION 5: CONTRACTOR RESPONSIBILITY & LIABILITY
                    The Contractor acknowledges receipt of the client-provided equipment in good operating condition and accepts sole contractual responsibility for its custody, operation, and safe keeping.
                    The Contractor shall be solely responsible and liable for any loss, physical damage, theft, water/liquid damage, or accidental destruction of the equipment during the period from handover until confirmed physical return to the Client.
                    """;

            ProjectAgreement agreement = ProjectAgreement.builder()
                    .project(savedProject)
                    .documentName("ABC_Events_Wedding_Photography_Contract.pdf")
                    .documentText(agreementText)
                    .build();
            agreementAnalysisService.analyzeAgreement(agreement);
            agreementRepository.save(agreement);

            // 4. Equipment items
            Equipment camera = Equipment.builder()
                    .project(savedProject)
                    .equipmentType("Camera")
                    .brand("Sony")
                    .model("A7 IV Full-Frame Mirrorless")
                    .serialNumber("SN-SONY-998812")
                    .declaredValue(200000.0)
                    .condition(EquipmentCondition.GOOD)
                    .ownerName("ABC Events Pvt Ltd")
                    .ownershipEvidence("Client Asset Register #ABC-CAM-01 / Purchase Inv #INV-882")
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .build();

            Equipment lens = Equipment.builder()
                    .project(savedProject)
                    .equipmentType("Lens")
                    .brand("Sony G-Master")
                    .model("FE 24-70mm f/2.8 GM II")
                    .serialNumber("SN-LENS-445521")
                    .declaredValue(80000.0)
                    .condition(EquipmentCondition.GOOD)
                    .ownerName("ABC Events Pvt Ltd")
                    .ownershipEvidence("Client Asset Register #ABC-LENS-04")
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .build();

            Equipment drone = Equipment.builder()
                    .project(savedProject)
                    .equipmentType("Drone")
                    .brand("DJI")
                    .model("Mavic 3 Pro Cine")
                    .serialNumber("SN-DJI-771109")
                    .declaredValue(120000.0)
                    .condition(EquipmentCondition.GOOD)
                    .ownerName("ABC Events Pvt Ltd")
                    .ownershipEvidence("Client Asset Register #ABC-DRN-02 / DGCA Registered")
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .build();

            Equipment savedCamera = equipmentRepository.save(camera);
            Equipment savedLens = equipmentRepository.save(lens);
            Equipment savedDrone = equipmentRepository.save(drone);

            // 5. Handover Records (Dual Confirmation Chain of Custody)
            EquipmentHandover h1 = EquipmentHandover.builder()
                    .projectId(savedProject.getId())
                    .equipment(savedCamera)
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .handoverCondition(EquipmentCondition.GOOD)
                    .clientConfirmation(true)
                    .freelancerConfirmation(true)
                    .handoverNotes("Inspected sensor and body; spotless condition.")
                    .build();

            EquipmentHandover h2 = EquipmentHandover.builder()
                    .projectId(savedProject.getId())
                    .equipment(savedLens)
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .handoverCondition(EquipmentCondition.GOOD)
                    .clientConfirmation(true)
                    .freelancerConfirmation(true)
                    .handoverNotes("Optics clean, autofocus responsive.")
                    .build();

            EquipmentHandover h3 = EquipmentHandover.builder()
                    .projectId(savedProject.getId())
                    .equipment(savedDrone)
                    .handoverDate(LocalDate.of(2026, 10, 10))
                    .handoverCondition(EquipmentCondition.GOOD)
                    .clientConfirmation(true)
                    .freelancerConfirmation(true)
                    .handoverNotes("Includes 3 batteries and controller. Propellers checked.")
                    .build();

            handoverRepository.save(h1);
            handoverRepository.save(h2);
            handoverRepository.save(h3);

            log.info("Initialized project 'Wedding Photography' with ₹4,00,000 total client equipment value and verified custody handover!");
        }
    }
}

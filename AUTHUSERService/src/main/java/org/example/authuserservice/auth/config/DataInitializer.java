package org.example.authuserservice.auth.config;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.authuserservice.auth.entity.User;
import org.example.authuserservice.auth.entity.UserProfile;
import org.example.authuserservice.auth.repository.UserProfileRepository;
import org.example.authuserservice.auth.repository.UserRepository;
import org.example.authuserservice.common.enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial users into auth-user-service database...");

            // 1. Rahul Kumar - Freelancer Photographer
            User freelancer = User.builder()
                    .name("Rahul Kumar")
                    .email("rahul@freelance.in")
                    .password(passwordEncoder.encode("password123"))
                    .phone("+91-9876543210")
                    .role(Role.ROLE_FREELANCER)
                    .active(true)
                    .build();
            User savedFreelancer = userRepository.save(freelancer);

            UserProfile freelancerProfile = UserProfile.builder()
                    .user(savedFreelancer)
                    .profession("Freelance Photographer")
                    .experienceYears(4)
                    .city("Hyderabad")
                    .address("Banjara Hills, Road No. 12, Hyderabad, Telangana")
                    .averageMonthlyIncome(80000.0)
                    .kycVerified(true)
                    .kycDocumentType("PAN")
                    .kycDocumentNumber("ABCDE1234F")
                    .build();
            userProfileRepository.save(freelancerProfile);

            // 2. Priya Sharma - Assessor
            User assessor = User.builder()
                    .name("Priya Sharma")
                    .email("assessor@secure360.in")
                    .password(passwordEncoder.encode("assessor123"))
                    .phone("+91-9876500001")
                    .role(Role.ROLE_ASSESSOR)
                    .active(true)
                    .build();
            User savedAssessor = userRepository.save(assessor);

            UserProfile assessorProfile = UserProfile.builder()
                    .user(savedAssessor)
                    .profession("Senior Claims Underwriter & Assessor")
                    .experienceYears(8)
                    .city("Mumbai")
                    .kycVerified(true)
                    .build();
            userProfileRepository.save(assessorProfile);

            // 3. Admin User
            User admin = User.builder()
                    .name("Admin System")
                    .email("admin@secure360.in")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91-9876500000")
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            User savedAdmin = userRepository.save(admin);

            UserProfile adminProfile = UserProfile.builder()
                    .user(savedAdmin)
                    .profession("Platform Administrator")
                    .experienceYears(10)
                    .city("Bengaluru")
                    .kycVerified(true)
                    .build();
            userProfileRepository.save(adminProfile);

            log.info("Initialized default users: rahul@freelance.in, assessor@secure360.in, admin@secure360.in");
        }
    }
}

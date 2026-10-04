package org.example.authuserservice.auth.service;


import lombok.RequiredArgsConstructor;
import org.example.authuserservice.auth.entity.User;
import org.example.authuserservice.auth.entity.UserProfile;
import org.example.authuserservice.auth.repository.UserProfileRepository;
import org.example.authuserservice.auth.repository.UserRepository;
import org.example.authuserservice.common.dto.AuthRequest;
import org.example.authuserservice.common.dto.AuthResponse;
import org.example.authuserservice.common.dto.RegisterRequest;
import org.example.authuserservice.common.dto.UserDTO;
import org.example.authuserservice.common.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email is already registered: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(req.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .profession(req.getProfession())
                .experienceYears(req.getExperienceYears())
                .city(req.getCity())
                .averageMonthlyIncome(req.getAverageMonthlyIncome())
                .kycVerified(true)
                .build();

        userProfileRepository.save(profile);

        String token = jwtUtils.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getName(), savedUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole())
                .profession(profile.getProfession())
                .build();
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String profession = null;
        if (user.getProfile() != null) {
            profession = user.getProfile().getProfession();
        } else {
            var profileOpt = userProfileRepository.findByUserId(user.getId());
            if (profileOpt.isPresent()) {
                profession = profileOpt.get().getProfession();
            }
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getName(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .profession(profession)
                .build();
    }

    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .profession(profile != null ? profile.getProfession() : null)
                .experienceYears(profile != null ? profile.getExperienceYears() : null)
                .city(profile != null ? profile.getCity() : null)
                .averageMonthlyIncome(profile != null ? profile.getAverageMonthlyIncome() : null)
                .kycVerified(profile != null && Boolean.TRUE.equals(profile.getKycVerified()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public UserDTO updateUserProfile(Long userId, UserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        userRepository.save(user);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> UserProfile.builder().user(user).build());

        if (dto.getProfession() != null) profile.setProfession(dto.getProfession());
        if (dto.getExperienceYears() != null) profile.setExperienceYears(dto.getExperienceYears());
        if (dto.getCity() != null) profile.setCity(dto.getCity());
        if (dto.getAverageMonthlyIncome() != null) profile.setAverageMonthlyIncome(dto.getAverageMonthlyIncome());
        userProfileRepository.save(profile);

        return getUserProfile(userId);
    }

    public java.util.List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);
                    return UserDTO.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .phone(user.getPhone())
                            .role(user.getRole())
                            .profession(profile != null ? profile.getProfession() : null)
                            .experienceYears(profile != null ? profile.getExperienceYears() : null)
                            .city(profile != null ? profile.getCity() : null)
                            .averageMonthlyIncome(profile != null ? profile.getAverageMonthlyIncome() : null)
                            .kycVerified(profile != null && Boolean.TRUE.equals(profile.getKycVerified()))
                            .createdAt(user.getCreatedAt())
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }
}

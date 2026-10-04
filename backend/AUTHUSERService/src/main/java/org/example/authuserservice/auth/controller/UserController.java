package org.example.authuserservice.auth.controller;

import lombok.RequiredArgsConstructor;
import org.example.authuserservice.auth.service.AuthService;
import org.example.authuserservice.common.dto.ApiResponse;
import org.example.authuserservice.common.dto.UserDTO;
import org.example.authuserservice.common.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal principal) {

        UserDTO profile = authService.getUserProfile(principal.getId());

        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserDTO dto) {

        UserDTO updated =
                authService.updateUserProfile(principal.getId(), dto);

        return ResponseEntity.ok(
                ApiResponse.ok("Profile updated successfully", updated));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(authService.getAllUsers()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(
            @PathVariable Long id) {

        UserDTO user = authService.getUserProfile(id);

        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
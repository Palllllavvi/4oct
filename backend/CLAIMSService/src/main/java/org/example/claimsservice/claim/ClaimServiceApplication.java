package org.example.claimsservice.claim;

import org.example.claimsservice.client.FeignConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = "org.example.claimsservice")
@EnableFeignClients(basePackages = "org.example.claimsservice.client", defaultConfiguration = FeignConfig.class)
public class ClaimServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClaimServiceApplication.class, args);
    }
}

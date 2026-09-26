package org.example.riskunderwritingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.example.riskunderwritingservice")
public class RiskUnderwritingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RiskUnderwritingServiceApplication.class, args);
    }
}
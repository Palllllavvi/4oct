package org.example.policyservice;

import org.example.policyservice.client.FeignConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = "org.example.policyservice")
@EnableFeignClients(basePackages = "org.example.policyservice.client", defaultConfiguration = FeignConfig.class)
public class PolicyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PolicyServiceApplication.class, args);
    }
}
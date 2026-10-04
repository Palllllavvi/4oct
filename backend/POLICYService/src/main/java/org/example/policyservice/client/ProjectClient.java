package org.example.policyservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "PROJECTEQUIPMENT-SERVICE")
public interface ProjectClient {

    @PutMapping("/api/projects/{id}/policy-link")
    void linkPolicy(
            @PathVariable("id") Long projectId,
            @RequestParam("policyNumber") String policyNumber);
}
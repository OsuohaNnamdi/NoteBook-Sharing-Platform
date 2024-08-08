package com.LASU.project.Controller;

import com.LASU.project.Entity.LoginRequest;
import com.LASU.project.Entity.LoginResponse;
import com.LASU.project.Entity.Profile;
import com.LASU.project.Service.Implementation.ProfileImplementation;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1")
public class ProfileController {

    private final ProfileImplementation profileImplementation;

    public ProfileController(ProfileImplementation profileImplementation) {
        this.profileImplementation = profileImplementation;
    }


    @PostMapping("/register")
    public ResponseEntity<?> Add_users(@RequestBody Profile profile){

        profileImplementation.addUsers(profile);
        return  ResponseEntity
                .ok()
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        LoginResponse response = profileImplementation.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, response.token())
                .body(response);
    }

}

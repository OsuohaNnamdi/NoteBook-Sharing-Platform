package com.LASU.project.Controller;

import com.LASU.project.DTO.ProfileDTO;
import com.LASU.project.Entity.LoginRequest;
import com.LASU.project.Entity.LoginResponse;
import com.LASU.project.Entity.Profile;
import com.LASU.project.Service.Implementation.ProfileImplementation;
import org.springframework.http.HttpHeaders;
import com.LASU.project.Exception.ProfileException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
@RequestMapping(path = "/api/v1")
public class ProfileController {

    private final ProfileImplementation profileImplementation;

    public ProfileController(ProfileImplementation profileImplementation) {
        this.profileImplementation = profileImplementation;
    }
    @GetMapping("/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {
        try {
            ProfileDTO profile = profileImplementation.getProfileByEmail(email);
            return  ResponseEntity
                .ok()
                .body(profile); 
        } catch (ProfileException e) {
            
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
    
     @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestBody String query) {
        try {
            List<ProfileDTO> profiles = profileImplementation.searchProfiles(query);
            return ResponseEntity.ok(profiles);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving users", e);
        }
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

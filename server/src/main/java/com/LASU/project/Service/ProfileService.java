package com.LASU.project.Service;


import com.LASU.project.DTO.ProfileDTO;
import com.LASU.project.Entity.LoginRequest;
import com.LASU.project.Entity.LoginResponse;
import com.LASU.project.Entity.Profile;
import com.LASU.project.Exception.ProfileException;

import java.util.List;

public interface ProfileService {

    void addUsers(Profile profile) throws ProfileException;

    LoginResponse login(LoginRequest request) throws ProfileException;

    List<ProfileDTO> searchProfiles(String query);

    ProfileDTO getProfileByEmail(String email);

    List<ProfileDTO> listAllProfiles();

    void updateProfile(Long id, Profile request);

    void deleteById(Long id);
}

package com.LASU.project.Repository;


import com.LASU.project.Entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long>
{
   Optional<Profile> findByEmail(String email);
}

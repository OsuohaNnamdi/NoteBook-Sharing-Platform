package com.LASU.project.Repository;

import com.LASU.project.Entity.Individuals;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IndividualsRepository extends JpaRepository <Individuals, Long> {

    Optional<Individuals> findByNameAndEmailAndChatId (String name, String email, Long chatId);
    List<Individuals> findByChatIdOrderByTimestampDesc(Long chatId);
}

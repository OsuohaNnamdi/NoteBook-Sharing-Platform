package com.LASU.project.Repository;

import com.LASU.project.Entity.Course;
import com.LASU.project.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndRecipient(String sender, String recipient);
}

package com.LASU.project.Repository;

import com.LASU.project.Entity.Course;
import com.LASU.project.Entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndRecipient(String sender, String recipient);
    List<Message> findBySender(String sender);
    List<Message> findByRecipient(String recipient);
//    List<Message> findTop1ByChatIdOrderByTimestampDesc(Long id);
//    List<Message> findByChatIdAndRecipientAndIsReadFalse(Long chatId, String recipient);
//    Long countByChatIdAndRecipientAndIsReadFalse(Long chatId, String recipient);
}

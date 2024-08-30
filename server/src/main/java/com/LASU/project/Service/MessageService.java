package com.LASU.project.Service;

import com.LASU.project.Entity.Message;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MessageService {


    void saveMessage (Message request, MultipartFile file)throws IOException;

    List<Message> getMessages(String sender, String recipient);

    List<Message> getAllMessages();
}

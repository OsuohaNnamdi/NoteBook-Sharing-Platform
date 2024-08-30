package com.LASU.project.Service.Implementation;


import com.LASU.project.Entity.Message;
import com.LASU.project.Repository.MessageRepository;
import com.LASU.project.Service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageImplementation implements MessageService {

    private final MessageRepository messageRepository;
    private final CloudinaryService cloudinaryService;


    public MessageImplementation(MessageRepository messageRepository, CloudinaryService cloudinaryService) {
        this.messageRepository = messageRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public void saveMessage(Message request, MultipartFile file)throws IOException {

        Message message = new Message();

        message.setSender(request.getSender());
        message.setRecipient(request.getRecipient());
        message.setText(request.getText());
        message.setTimestamp(LocalDateTime.now());

        if (file != null || file.isEmpty()){

            String responses =  cloudinaryService.uploadImage(file);
            message.setFileUrl(responses);

        }

        messageRepository.save(message);

    }

    @Override
    public List<Message> getMessages(String sender, String recipient){

        return messageRepository.findBySenderAndRecipient(sender, recipient);
    }

    @Override
    public List<Message> getAllMessages(){

        return messageRepository.findAll();
    }
}

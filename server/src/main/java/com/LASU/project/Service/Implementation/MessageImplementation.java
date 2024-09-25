package com.LASU.project.Service.Implementation;


import com.LASU.project.Entity.Individuals;
import com.LASU.project.Entity.Message;
import com.LASU.project.Entity.Profile;
import com.LASU.project.Exception.ProfileException;
import com.LASU.project.Repository.IndividualsRepository;
import com.LASU.project.Repository.MessageRepository;
import com.LASU.project.Repository.ProfileRepository;
import com.LASU.project.Service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageImplementation implements MessageService {

    private final MessageRepository messageRepository;
    private final IndividualsRepository individualsRepository;
    private final ProfileRepository profileRepository;
    private final CloudinaryService cloudinaryService;


    public MessageImplementation(MessageRepository messageRepository, IndividualsRepository individualsRepository, ProfileRepository profileRepository, CloudinaryService cloudinaryService) {
        this.messageRepository = messageRepository;
        this.individualsRepository = individualsRepository;
        this.profileRepository = profileRepository;
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

        saveMessage2(request, file);
        messageRepository.save(message);
        newIndividual(request);

    }


    public void saveMessage2(Message request, MultipartFile file)throws IOException {

        Message message = new Message();

        message.setSender(request.getRecipient());
        message.setRecipient(request.getSender());
        message.setText(request.getText());
        message.setTimestamp(LocalDateTime.now());

        if (file != null || file.isEmpty()){

            String responses =  cloudinaryService.uploadImage(file);
            message.setFileUrl(responses);

        }

        messageRepository.save(message);

    }


    public List<Individuals> IndividualList (Long id){

        return individualsRepository.findByChatIdOrderByTimestampDesc(id);

    }

    @Override
    public List<Message> getMessages(String sender, String recipient){

        return messageRepository.findBySenderAndRecipient(sender, recipient);
    }

    @Override
   public List<Message> getAllMessages(){

        return messageRepository.findAll();
    }

    @Override
    public void saveMessageNoFile(Message request) {

        Message message = new Message();

        message.setSender(request.getSender());
        message.setRecipient(request.getRecipient());
        message.setText(request.getText());
        message.setTimestamp(LocalDateTime.now());



        saveMessageNoFile2(request);
        messageRepository.save(message);
        newIndividual(request);
    }

    @Override
    public void deleteById(Long id) {
        messageRepository.deleteById(id);
    }

    private void saveMessageNoFile2(Message request) {

        Message message = new Message();

        message.setSender(request.getRecipient());
        message.setRecipient(request.getSender());
        message.setText(request.getText());
        message.setTimestamp(LocalDateTime.now());

        messageRepository.save(message);
    }

    public List<Message> getSender(String sender){

        return messageRepository.findBySender(sender);
    }

    public List<Message> getRecipient(String recipient){

        return messageRepository.findByRecipient(recipient);
    }


    public void newIndividual(Message message) {
        Profile recipientProfile = profileRepository.findByEmail(message.getRecipient())
                .orElseThrow(() -> new ProfileException("Recipient not found"));
        Profile senderProfile = profileRepository.findByEmail(message.getSender())
                .orElseThrow(() -> new ProfileException("Sender not found"));


        Optional<Individuals> recipientEntry = individualsRepository.findByNameAndEmailAndChatId(
                recipientProfile.getFullName(), recipientProfile.getEmail(), senderProfile.getId());

        if (recipientEntry.isEmpty()) {
            Individuals newRecipient = new Individuals();
            newRecipient.setName(recipientProfile.getFullName());
            newRecipient.setEmail(recipientProfile.getEmail());
            newRecipient.setChatId(senderProfile.getId()); // Chat is identified by sender's ID
            newRecipient.setTimestamp(LocalDateTime.now());
            individualsRepository.save(newRecipient);
        } else {
            Individuals existingRecipientEntry = recipientEntry.get();
            existingRecipientEntry.setTimestamp(LocalDateTime.now());
            individualsRepository.save(existingRecipientEntry);
        }


        Optional<Individuals> senderEntry = individualsRepository.findByNameAndEmailAndChatId(
                senderProfile.getFullName(), senderProfile.getEmail(), recipientProfile.getId());

        if (senderEntry.isEmpty()) {
            Individuals newSender = new Individuals();
            newSender.setName(senderProfile.getFullName());
            newSender.setEmail(senderProfile.getEmail());
            newSender.setChatId(recipientProfile.getId()); // Chat is identified by recipient's ID
            newSender.setTimestamp(LocalDateTime.now());
            individualsRepository.save(newSender);
        } else {
            Individuals existingSenderEntry = senderEntry.get();
            existingSenderEntry.setTimestamp(LocalDateTime.now());
            individualsRepository.save(existingSenderEntry);
        }
    }

}

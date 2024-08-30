package com.LASU.project.Controller;


import com.LASU.project.Entity.Course;
import com.LASU.project.Entity.Message;
import com.LASU.project.Exception.GeneralException;
import com.LASU.project.Service.Implementation.MessageImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/message")
public class MessageController {

    private final MessageImplementation messageImplementation;

    public MessageController(MessageImplementation messageImplementation) {
        this.messageImplementation = messageImplementation;
    }

    @GetMapping("/{sender}/{recipient}")
    public ResponseEntity<List<?>> getAllUserMessage(@PathVariable String sender, @PathVariable String recipient) {
        try {
            List<Message> messages = messageImplementation.getMessages(sender,recipient);
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (GeneralException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping
    public ResponseEntity<List<?>> getAllMessage() {
        try {
            List<Message> messages = messageImplementation.getAllMessages();
            return new ResponseEntity<>(messages, HttpStatus.OK);
        } catch (GeneralException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/add")
    public ResponseEntity<?> saveCourse(
            @ModelAttribute Message message,
            @RequestPart(name = "document" ,required = false) MultipartFile document) {
        try {
            messageImplementation.saveMessage(message, document);
            return new ResponseEntity<>("Course saved successfully", HttpStatus.CREATED);
        } catch (GeneralException | IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

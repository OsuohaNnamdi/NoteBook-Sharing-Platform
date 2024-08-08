package com.LASU.project.Controller;

import com.LASU.project.Entity.Past_Question;
import com.LASU.project.Exception.GeneralException;
import com.LASU.project.Service.Past_QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/past-questions")
public class Past_QuestionController {

    private final Past_QuestionService pastQuestionService;

    public Past_QuestionController(Past_QuestionService pastQuestionService) {
        this.pastQuestionService = pastQuestionService;
    }

    @PostMapping
    public ResponseEntity<String> savePastQuestion(@RequestBody Past_Question request,
                                                   @RequestBody MultipartFile document) {
        try {
            pastQuestionService.savePastQuestion(request, document);
            return new ResponseEntity<>("Past Question saved successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Past_Question>> getAllPastQuestions() {
        try {
            List<Past_Question> pastQuestions = pastQuestionService.findAllPastQuestion();
            return new ResponseEntity<>(pastQuestions, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Past_Question>> searchPastQuestions(@RequestBody String keyword) {
        try {
            List<Past_Question> pastQuestions = pastQuestionService.searchPastQuestion(keyword);
            return new ResponseEntity<>(pastQuestions, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/school/{id}")
    public ResponseEntity<List<Past_Question>> findPastQuestionsBySchoolId(@PathVariable String id) {
        try {
            List<Past_Question> pastQuestions = pastQuestionService.findBySchoolId(id);
            return new ResponseEntity<>(pastQuestions, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePastQuestion(@PathVariable Long id) {
        try {
            pastQuestionService.deleteById(id);
            return new ResponseEntity<>("Past Question deleted successfully", HttpStatus.NO_CONTENT);
        } catch (GeneralException | IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}

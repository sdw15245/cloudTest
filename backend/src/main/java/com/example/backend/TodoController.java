package com.example.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getAll() {
        return todoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Todo> create(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(todoRepository.save(text.trim()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Todo> toggle(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setDone(!todo.isDone());
                    return ResponseEntity.ok(todo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/completed")
    public ResponseEntity<Void> clearCompleted() {
        todoRepository.deleteCompleted();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return todoRepository.deleteById(id)
                ? ResponseEntity.noContent().<Void>build()
                : ResponseEntity.notFound().build();
    }
}

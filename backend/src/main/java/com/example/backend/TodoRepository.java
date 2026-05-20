package com.example.backend;

import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class TodoRepository {
    private final List<Todo> todos = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public List<Todo> findAll() {
        return new ArrayList<>(todos);
    }

    public Todo save(String text) {
        Todo todo = new Todo(idCounter.getAndIncrement(), text);
        todos.add(todo);
        return todo;
    }

    public Optional<Todo> findById(Long id) {
        return todos.stream().filter(t -> t.getId().equals(id)).findFirst();
    }

    public boolean deleteById(Long id) {
        return todos.removeIf(t -> t.getId().equals(id));
    }

    public void deleteCompleted() {
        todos.removeIf(Todo::isDone);
    }
}

package com.innoluxion.veil.message;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("")
    public Page<Message> getMessageInChat(@RequestParam UUID receiver, @RequestParam UUID chat, Pageable pageable) {
        return messageService.getChats(receiver, pageable);
    }

    @GetMapping("/chats")
    public Page<Message> getChats(@RequestParam UUID from, Pageable pageable) {
        return messageService.getChats(from, pageable);
    }

}

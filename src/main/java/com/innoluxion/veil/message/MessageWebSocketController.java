package com.innoluxion.veil.message;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MessageWebSocketController {

    private final MessageService messageService;

    @MessageMapping("/send")
    public void sendChatMessage(@Payload List<Message> messages) {
        System.out.println(messages);
        messageService.sendMessages(messages);
    }
}

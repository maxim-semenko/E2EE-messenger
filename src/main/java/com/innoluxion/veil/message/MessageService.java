package com.innoluxion.veil.message;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.innoluxion.veil.message.Message.MessageType.CHAT;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public Page<Message> getChats(UUID from, Pageable pageable) {
        return messageRepository.findBySenderAndType(from, CHAT, pageable);
    }


    public void sendMessages(List<Message> messages) {
        if (messages == null || messages.isEmpty()) {
            return;
        }

        Message headMessage = messages.getFirst();
        if (headMessage.getType().equals(CHAT)) {
            if (headMessage.getSender().equals(headMessage.getReceiver())) {
                System.out.println("Owner");
            } else {
                System.out.println("send invite other");
            }
            messageRepository.saveAll(messages);
        }

        for (Message message : messages) {
            simpMessagingTemplate
                    .convertAndSendToUser(message.getReceiver().toString(), "/private", message);
        }

    }
}

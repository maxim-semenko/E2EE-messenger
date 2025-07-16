package com.innoluxion.veil.message;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "messages")
public class Message {

    enum MessageType {
        CHAT,
        HELLO,
        IAM,
        WHO,
        CONTENT,
        SERVER,
    }

    @Id
    @GeneratedValue
    private UUID id;

    @NonNull
    private UUID receiver;

    @NonNull
    private UUID sender;

    @NonNull
    private UUID chat;

    private String content;

    @NonNull
    private MessageType type;

}

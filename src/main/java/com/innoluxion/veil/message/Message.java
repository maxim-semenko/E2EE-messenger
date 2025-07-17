package com.innoluxion.veil.message;

import jakarta.persistence.*;
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

    public enum MessageType {
        CHAT,
        HELLO,
        IAM,
        WHO,
        CIPHER,
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

    @Column(length = 2048)
    private String content;

    private String iv;

    @NonNull
    @Enumerated(EnumType.STRING)
    private MessageType type;

}

package com.innoluxion.veil.message;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.Type;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "messages")
public class Message {

    enum MessageType {
        SERVER,
        WHO,
        IAM,
        TEXT,
    }

    @Id
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

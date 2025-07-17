package com.innoluxion.veil.util;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "utils")
public class Util {

    @Id
    @Enumerated(EnumType.STRING)
    private UtilKeyType utilKey;

    @Column(length = 2600, nullable = false)
    private String utilValue;


    public enum UtilKeyType {
        SERVER_USER_ID,
        SERVER_PRIVATE_KEY;
    }
}

package com.innoluxion.veil.util;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private UtilKeyType utilKey;

    private String utilValue;


    enum UtilKeyType {
        SERVER_ID,
        SERVER_PRIVATE_KEY;
    }
}

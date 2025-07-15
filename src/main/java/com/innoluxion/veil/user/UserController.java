package com.innoluxion.veil.user;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @Data
    public static class PublicKeyDto {
        private String publicKey;
    }

    @PostMapping
    public UUID authViaPublicKey(@RequestBody PublicKeyDto dto) {
        Optional<User> userOptional = userRepository.findByPublicKey(dto.getPublicKey());
        if (userOptional.isPresent()) {
            return userOptional.get().getId();
        }

        User user = new User();
        user.setPublicKey(dto.getPublicKey());
        userRepository.save(user);

        return user.getId();
    }

}

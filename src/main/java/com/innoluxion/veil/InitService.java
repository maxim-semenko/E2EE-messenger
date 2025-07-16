package com.innoluxion.veil;

import com.innoluxion.veil.user.User;
import com.innoluxion.veil.user.UserRepository;
import com.innoluxion.veil.util.Util;
import com.innoluxion.veil.util.UtilRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InitService {

    private final UtilRepository utilRepository;
    private final UserRepository userRepository;

    private int keySize = 3072;

    @Transactional
    public void recreateServerUser() throws NoSuchAlgorithmException {
        Optional<Util> util = utilRepository.findById(Util.UtilKeyType.SERVER_USER_ID);

        if (util.isPresent()) {
            return;
        }

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(keySize);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();

        String publicKeyPem = RsaKeyConverterUtil.publicKeyToPem(keyPair.getPublic());
        String privateKeyPem = RsaKeyConverterUtil.privateKeyToPem(keyPair.getPrivate());


        log.info("Public key: {}", publicKeyPem.length());
        log.info("Private key: {}", privateKeyPem.length());

        User serverUser = new User();
        serverUser.setPublicKey(publicKeyPem);

        userRepository.save(serverUser);

        utilRepository.save(new Util(Util.UtilKeyType.SERVER_USER_ID, serverUser.getId().toString()));
        utilRepository.save(new Util(Util.UtilKeyType.SERVER_PRIVATE_KEY, privateKeyPem));
    }

}

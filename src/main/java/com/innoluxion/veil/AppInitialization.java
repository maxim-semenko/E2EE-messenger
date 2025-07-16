package com.innoluxion.veil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppInitialization {

    private final InitService initService;

    @EventListener(ContextRefreshedEvent.class)
    public void postContextInitialization(ContextRefreshedEvent event) throws NoSuchAlgorithmException {
        log.info("Initialization method has started");
        initService.recreateServerUser();
    }

}

package com.innoluxion.veil.util;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UtilRepository extends JpaRepository<Util, Util.UtilKeyType> {
}

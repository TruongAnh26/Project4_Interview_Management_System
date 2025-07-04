package fa.training.HN24_CPL_JAVA_01_G3.base.local_cache;

import com.github.benmanes.caffeine.cache.Cache;

import java.time.OffsetDateTime;

public interface LocalCache {
    void putToUpdateAccountBlackList(Long userId);
    void putToLogOutAccountBlackList(String accessToken);
}

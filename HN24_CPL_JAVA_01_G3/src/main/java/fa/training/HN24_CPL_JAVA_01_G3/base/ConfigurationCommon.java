package fa.training.HN24_CPL_JAVA_01_G3.base;

import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.time.ZoneId;
import java.util.TimeZone;

@Configuration
public class ConfigurationCommon {
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("UTC")));
    }
}

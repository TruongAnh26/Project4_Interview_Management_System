package fa.training.HN24_CPL_JAVA_01_G3.common.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dv6lsushd",
                "api_key", "412631465393344",
                "api_secret", "qYqiVi_gBTlZRe1ae18k3yE45yw",
                "secure", true
        ));
    }
}

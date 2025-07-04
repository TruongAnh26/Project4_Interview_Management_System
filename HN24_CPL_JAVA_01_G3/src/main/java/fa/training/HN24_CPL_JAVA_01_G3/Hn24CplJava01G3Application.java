package fa.training.HN24_CPL_JAVA_01_G3;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

//@SecurityScheme(
//		name = "Authorization",
//		type = SecuritySchemeType.HTTP,
//		bearerFormat = "JWT",
//		scheme = "bearer"
//)
//@OpenAPIDefinition(info = @Info(title = "Library Apis",version = "V.1.0",description = "Documentation for Library Management apis"))
@SpringBootApplication
@EnableAspectJAutoProxy
@EnableScheduling
public class Hn24CplJava01G3Application {
	public static void main(String[] args) {
		SpringApplication.run(Hn24CplJava01G3Application.class, args);
	}
}

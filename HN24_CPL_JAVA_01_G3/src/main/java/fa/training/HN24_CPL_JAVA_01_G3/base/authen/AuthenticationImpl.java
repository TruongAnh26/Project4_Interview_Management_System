package fa.training.HN24_CPL_JAVA_01_G3.base.authen;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.RequestContext;
import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.TokenFilterChain;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class AuthenticationImpl {
    private TokenFilterChain tokenFilterChain;
    public AuthenticationImpl(@Qualifier("start-filter-chain") TokenFilterChain tokenFilterChain) {
        this.tokenFilterChain = tokenFilterChain;
    }

    @Before("@annotation(fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy)")
    public void validate(JoinPoint joinPoint) {
        String accessToken = getAccessTokenForParams(joinPoint);
        List<String> rolesAcceptForApi = getRolesAcceptFromParams(joinPoint);
        RequestContext requestContext = new RequestContext(accessToken, rolesAcceptForApi);

        tokenFilterChain.validate(requestContext);
    }

    private String getAccessTokenForParams(JoinPoint joinPoint){
        return (String) joinPoint.getArgs()[0];
    }

    private List<String> getRolesAcceptFromParams(JoinPoint joinPoint){
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] values = signature.getMethod().getAnnotation(AuthenticationProxy.class).acceptRoles();
        return List.of(values);
    }
}

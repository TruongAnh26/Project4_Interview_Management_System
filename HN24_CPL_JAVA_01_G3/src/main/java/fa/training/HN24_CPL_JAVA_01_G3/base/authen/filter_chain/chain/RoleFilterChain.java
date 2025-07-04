package fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.chain;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.RequestContext;
import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.TokenFilterChain;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component("role-filter-chain")
public class RoleFilterChain extends TokenFilterChain {
    private final TokenFilterChain tokenHandle;

    public RoleFilterChain(@Qualifier("end-filter-chain") TokenFilterChain tokenHandle) {
        this.tokenHandle = tokenHandle;
    }

    @Override
    public void validate(RequestContext requestContext) {
        if (!requestContext.getRolesAcceptOfThisApi().contains(
                TokenHelper.getRoleFromToken(requestContext.getAccessToken())
        )) {
            throw new RuntimeException(CodeAndMessage.ERR4);
        }
        System.out.println("Validate role success");
        if (Objects.nonNull(tokenHandle)){
            tokenHandle.validate(requestContext);
        }
    }
}

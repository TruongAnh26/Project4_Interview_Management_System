package fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.chain;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.RequestContext;
import fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain.TokenFilterChain;
import org.springframework.stereotype.Component;

@Component("end-filter-chain")
public class EndFilterChain extends TokenFilterChain {
    @Override
    public void validate(RequestContext requestContext) {
        System.out.println("*** Success validate token");
    }
}

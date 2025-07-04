package fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain;

public abstract class TokenFilterChain {
    protected TokenFilterChain tokenHandle;
    public abstract void validate(RequestContext requestContext);
}

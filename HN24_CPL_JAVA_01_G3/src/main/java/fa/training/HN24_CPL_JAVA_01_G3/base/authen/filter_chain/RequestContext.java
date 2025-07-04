package fa.training.HN24_CPL_JAVA_01_G3.base.authen.filter_chain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RequestContext {
    private String accessToken;
    private List<String> rolesAcceptOfThisApi;
}

package fa.training.HN24_CPL_JAVA_01_G3.service.account.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.*;

public interface UpdateAccountService {
    SuccessResponse signUp(SignUpRequest signUpRequestV2);
    TokenAndRole logIn(SignInRequest logInRequest);
    SuccessResponse updateAccount(String accessToken, Long id, UpdateAccountRequest updateAccountRequest);
    void updateStatusForAccount(String accessToken, Long id, String state);
    SuccessResponse logOut(String accessToken);
}

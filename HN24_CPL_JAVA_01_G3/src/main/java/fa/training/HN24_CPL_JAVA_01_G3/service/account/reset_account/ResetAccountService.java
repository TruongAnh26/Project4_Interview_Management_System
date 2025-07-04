package fa.training.HN24_CPL_JAVA_01_G3.service.account.reset_account;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.ForgotPasswordResponse;

public interface ResetAccountService {
    SuccessResponse isExistsUsername(String username);
    ForgotPasswordResponse forgotPassword(String username, String email);
    SuccessResponse resetPassword(Long userId, Integer otp);
}

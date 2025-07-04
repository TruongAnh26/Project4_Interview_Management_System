package fa.training.HN24_CPL_JAVA_01_G3.validation;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.SignUpRequest;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class AccountValidationHelper {
    private final AccountJPARepository accountJPARepository;

    public void signUpValidate(SignUpRequest signUpRequestV2){
        if (accountJPARepository.existsByEmail(signUpRequestV2.getEmail())){
            throw new RuntimeException(CodeAndMessage.ME0104);
        }
    }
}

package fa.training.HN24_CPL_JAVA_01_G3.service.account.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.base.local_cache.LocalCache;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.AccountStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.SignInRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.SignUpRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.TokenAndRole;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.UpdateAccountRequest;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.AccountMapper;
import fa.training.HN24_CPL_JAVA_01_G3.service.sendmail.SendEmailService;
import fa.training.HN24_CPL_JAVA_01_G3.validation.AccountValidationHelper;
import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.text.Normalizer;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class UpdateAccountServiceImpl implements UpdateAccountService {
    private final AccountJPARepository accountJPARepository;
    private final AccountMapper accountMapper;
    private final CustomRepository customRepository;
    private final LocalCache localCache;
    private final SendEmailService sendEmailService;
    private final AccountValidationHelper accountValidationHelper;

    @Transactional
    @Override
    public SuccessResponse signUp(SignUpRequest signUpRequestV2){
        accountValidationHelper.signUpValidate(signUpRequestV2);
        AccountEntity accountEntity = accountMapper.getEntityBy(signUpRequestV2);
        generateDefaultValueWhenCreateAccount(accountEntity);
        accountJPARepository.save(accountEntity);
        return SuccessHandle.success(CodeAndMessage.ME027);
    }

    @Transactional(readOnly = true)
    @Override
    public TokenAndRole logIn(SignInRequest logInRequest){
        AccountEntity userEntity = accountJPARepository.findByUsername(logInRequest.getUsername());
        if (Objects.isNull(userEntity) || userEntity.getStatus().equals(AccountStatusEnum.IN_ACTIVE.name())){
            throw new RuntimeException(CodeAndMessage.ERR3);
        }
        String currentHashedPassword = userEntity.getPassword();
        if (BCrypt.checkpw(logInRequest.getPassword(), currentHashedPassword)){
            String accessToken = TokenHelper.generateToken(userEntity);
            return new TokenAndRole(accessToken, userEntity.getRole());
        }
        throw new RuntimeException(CodeAndMessage.ERR3);
    }

    @Override
    @Transactional
    public SuccessResponse updateAccount(String accessToken, Long id, UpdateAccountRequest updateAccountRequest) {
        AccountEntity accountEntity = customRepository.getAccountEntityBy(id);
        updateBlackListWhenUpdateRoleOrInvalidUser(id, updateAccountRequest, accountEntity);
        accountMapper.updateEntityByUpdateAccount(accountEntity, updateAccountRequest);
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    @Override
    @Transactional
    public void updateStatusForAccount(String accessToken, Long id, String state) {
        AccountEntity accountEntity = customRepository.getAccountEntityBy(id);
        accountEntity.setStatus(state);
        accountJPARepository.save(accountEntity);
    }

    @Override
    @Transactional
    public SuccessResponse logOut(String accessToken) {
        localCache.putToLogOutAccountBlackList(accessToken);
        return SuccessHandle.success(CodeAndMessage.ME100);
    }

    private void generateDefaultValueWhenCreateAccount(AccountEntity accountEntity){
        accountEntity.setStatus(AccountStatusEnum.ACTIVE.name());
        generateDefaultUsername(accountEntity);
        generateDefaultPassword(accountEntity);
    }

    private void generateDefaultUsername(AccountEntity accountEntity){
        String[] v = accountEntity.getFullName().split(" ");
        StringBuilder usernamePreviousAddNumberBuilder = new StringBuilder(v[v.length-1]);
        for (int i = 0 ; i < v.length - 1 ; i ++){
            usernamePreviousAddNumberBuilder.append(v[i].charAt(0));
        }
        String usernamePreviousAddNumber = new String(usernamePreviousAddNumberBuilder);

        usernamePreviousAddNumber = usernamePreviousAddNumber.replace('Đ', 'D').replace('đ', 'd');
        String temp = Normalizer.normalize(usernamePreviousAddNumber, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        usernamePreviousAddNumber = pattern.matcher(temp).replaceAll("");

        accountEntity.setUsernamePreviousGenNumber(usernamePreviousAddNumber);
        usernamePreviousAddNumberBuilder = new StringBuilder(usernamePreviousAddNumber);
        Long number = accountJPARepository.countByUsernamePreviousGenNumber(usernamePreviousAddNumber);
        number++;
        accountEntity.setUsername(new String(usernamePreviousAddNumberBuilder.append(number)));
    }

    private void generateDefaultPassword(AccountEntity accountEntity){
        String randomPassword = UUID.randomUUID().toString();
        accountEntity.setPassword(BCrypt.hashpw(randomPassword, BCrypt.gensalt()));
        // send email to user
        try {
            sendEmailService.sendEmail(
                    accountEntity.getEmail(),
                    "no-reply-email-IMS-system " + accountEntity.getUsername(),
                    sendEmailService.generateEmailContentForCreateAccount(
                            accountEntity.getUsername(),
                            randomPassword,
                            Common.DEFAULT_RECRUITER_EMAIL
                    ),
                    null
            );
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(CodeAndMessage.ME026);
        }
    }

    private void updateBlackListWhenUpdateRoleOrInvalidUser(Long userId,
                                                            UpdateAccountRequest updateAccountRequest,
                                                            AccountEntity accountEntity){
        if (!updateAccountRequest.getRole().equals(accountEntity.getRole()) ||
                AccountStatusEnum.IN_ACTIVE.name().equals(updateAccountRequest.getStatus())){
            localCache.putToUpdateAccountBlackList(userId);
        }
    }
}

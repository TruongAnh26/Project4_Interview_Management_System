package fa.training.HN24_CPL_JAVA_01_G3.service.account.reset_account;

import com.github.benmanes.caffeine.cache.Cache;
import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.ForgotPasswordResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.sendmail.SendEmailService;
import lombok.AllArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@AllArgsConstructor
public class ResetAccountServiceImpl implements ResetAccountService {
    private final Cache<Long, Integer> otpCache;
    private final CustomRepository customRepository;
    private final SendEmailService sendEmailService;
    private final AccountJPARepository accountJPARepository;

    @Override
    @Transactional(readOnly = true)
    public SuccessResponse isExistsUsername(String username) {
        Boolean result = accountJPARepository.existsByUsername(username);
        return Boolean.TRUE.equals(result) ? SuccessHandle.success(CodeAndMessage.ME100)
                : SuccessHandle.success(CodeAndMessage.ERR0);
    }

    @Override
    @Transactional
    public ForgotPasswordResponse forgotPassword(String username, String email) {
        AccountEntity accountEntity = customRepository.getAccountEntityBy(email);
        if (!username.equals(accountEntity.getUsername())){
            throw new RuntimeException(CodeAndMessage.ME102);
        }
        print();
        Long userIdForForgotPass = accountEntity.getId();
//        if (otpCache.asMap().containsKey(userIdForForgotPass)) {
//            throw new RuntimeException(CodeAndMessage.ERR0);
//        }
        Integer otp = generateRandomOtp();
        // send to mail otp
        CompletableFuture.runAsync(() -> sendOtpToEmail(otp, accountEntity));
        otpCache.put(userIdForForgotPass, otp);
        SuccessResponse successResponse = SuccessHandle.success(CodeAndMessage.ME100);
        return ForgotPasswordResponse.builder()
                .code(successResponse.getCode())
                .message(successResponse.getMessage())
                .userId(accountEntity.getId())
                .build();
    }

    @Override
    @Transactional
    public SuccessResponse resetPassword(Long userId, Integer otp) {
        print();
        // không có otp
        if (!otpCache.asMap().containsKey(userId)) {
            throw new RuntimeException(CodeAndMessage.ERR0);
        }
        // sai otp
        AccountEntity accountEntity = customRepository.getAccountEntityBy(userId);
        if (!otp.equals(otpCache.asMap().get(userId))) {
            // gửi otp mới tới gmail + bắt nhập lại từ đầu
            Integer newOtp = generateRandomOtp();
            print();
            CompletableFuture.runAsync(() -> {
                sendOtpToEmail(newOtp, accountEntity);
            });
            otpCache.put(userId, newOtp);
            print();
            throw new RuntimeException(CodeAndMessage.ERR0);
        }
        // nếu đúng otp
        String randomPassword = UUID.randomUUID().toString();
        accountEntity.setPassword(BCrypt.hashpw(randomPassword, BCrypt.gensalt()));
        accountJPARepository.save(accountEntity);
        // -> gửi password về email user
        CompletableFuture.runAsync(() -> {
            try {
                sendEmailService.sendEmail(
                        accountEntity.getEmail(),
                        "Success reset password",
                        sendEmailService.generateSuccessRecoverPassword(randomPassword),
                        null
                );
            } catch (MessagingException | UnsupportedEncodingException e) {
                throw new RuntimeException(CodeAndMessage.ERR0);
            }
        });
        return SuccessHandle.success(CodeAndMessage.ME100);
    }

    private void sendOtpToEmail(Integer otp, AccountEntity accountEntity) {
        try {
            print();
            sendEmailService.sendEmail(
                    accountEntity.getEmail(),
                    "Recover account",
                    sendEmailService.generateOtpContentWhenForgotPassword(otp),
                    null
            );
            print();
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(CodeAndMessage.ERR0);
        }
    }

    private void print() {
        System.out.println("*** Otp queue");
        otpCache.asMap().forEach((jtI, b) -> {
            System.out.println("key: " + jtI + " - value: " + b);
        });

    }

    private Integer generateRandomOtp() {
        Random random = new Random();
        int sixDigitNumber = random.nextInt(1000000);
        String formattedNumber = String.format("%06d", sixDigitNumber);
        return Integer.valueOf(formattedNumber);
    }
}

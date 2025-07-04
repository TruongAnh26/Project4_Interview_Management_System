package fa.training.HN24_CPL_JAVA_01_G3.service.account;


import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.SignUpRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.UpdateAccountRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.InterviewerScheduleResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper
public interface AccountMapper {
    AccountListResponse getResponseListBy(AccountEntity accountEntity);

    InterviewerScheduleResponse getInterviewerInfor(AccountEntity accountEntity);
    AccountEntity getEntityBy(SignUpRequest signUpRequestV2);
    AccountDetailResponse getResponseBy(AccountEntity accountEntity);
    void updateEntityByUpdateAccount(@MappingTarget AccountEntity accountEntity, UpdateAccountRequest updateAccountRequest);
}

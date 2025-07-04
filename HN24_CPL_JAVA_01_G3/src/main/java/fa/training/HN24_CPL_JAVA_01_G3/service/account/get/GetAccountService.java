package fa.training.HN24_CPL_JAVA_01_G3.service.account.get;

import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GetAccountService {
    AccountDetailResponse getAccount(Long id);
    Page<AccountListResponse> getAccountsBy(String search, String role, Pageable pageable);
}

package fa.training.HN24_CPL_JAVA_01_G3.service.account.get;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountDetailResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.AccountListResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.DepartmentEntity;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.AccountMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class GetAccountServiceImpl implements GetAccountService{
    private final CustomRepository customRepository;
    private final AccountMapper accountMapper;

    @Override
    @Transactional(readOnly = true)
    public AccountDetailResponse getAccount(Long id) {
        AccountEntity accountEntity = customRepository.getAccountEntityBy(id);
        AccountDetailResponse accountDetailResponse = accountMapper.getResponseBy(accountEntity);
        setMapValuesForAccountDetailResponse(accountDetailResponse);
        return accountDetailResponse;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AccountListResponse> getAccountsBy(String search, String role, Pageable pageable) {
        return customRepository.getAccountBy(search, role, pageable).map(accountMapper::getResponseListBy);
    }

    private void setMapValuesForAccountDetailResponse(AccountDetailResponse accountDetailResponse){
        DepartmentEntity departmentEntity =
                customRepository.getDepartmentEntityBy(accountDetailResponse.getDepartmentId());
        accountDetailResponse.setDepartment(new IdAndName(departmentEntity.getId(), departmentEntity.getName()));
    }
}

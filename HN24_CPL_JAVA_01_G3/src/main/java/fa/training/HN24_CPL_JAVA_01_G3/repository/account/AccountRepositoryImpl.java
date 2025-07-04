//package fa.training.HN24_CPL_JAVA_01_G3.repository.account;
//
//import fa.training.HN24_CPL_JAVA_01_G3.base.BaseRepository;
//import fa.training.HN24_CPL_JAVA_01_G3.base.BaseRepositoryAdapter;
//import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class AccountRepositoryImpl extends BaseRepositoryAdapter<AccountEntity> implements AccountRepository{
//    private final AccountJPARepository accountJPARepository;
//
//    public AccountRepositoryImpl(BaseRepository<AccountEntity> jpaRepository, AccountJPARepository accountJPARepository) {
//        super(jpaRepository);
//        this.accountJPARepository = accountJPARepository;
//    }
//
//    @Override
//    public AccountEntity findByUsername(String username) {
//        return null;
//    }
//
//    @Override
//    public Boolean existsByUsername(String username) {
//        return null;
//    }
//}

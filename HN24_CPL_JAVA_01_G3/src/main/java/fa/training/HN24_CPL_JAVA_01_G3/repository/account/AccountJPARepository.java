package fa.training.HN24_CPL_JAVA_01_G3.repository.account;

//import fa.training.HN24_CPL_JAVA_01_G3.base.BaseRepository;
import fa.training.HN24_CPL_JAVA_01_G3.entity.AccountEntity;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.crypto.BadPaddingException;
import java.util.Collection;
import java.util.List;

@Repository
//public interface AccountJPARepository extends BaseRepository<AccountEntity> {
public interface AccountJPARepository extends JpaRepository<AccountEntity, Long> {
    Long countByUsernamePreviousGenNumber(String username);
    AccountEntity findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    List<AccountEntity> findAllByIdIn(Collection<Long> ids);
    AccountEntity findFirstById(Long id);
    AccountEntity findByEmail(String email);
}

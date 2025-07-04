package fa.training.HN24_CPL_JAVA_01_G3.repository.custom;

import fa.training.HN24_CPL_JAVA_01_G3.base.filter.Filter;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

@Repository
@AllArgsConstructor
public class MasterDataRepository {
    private final EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<IdAndName> getScheduleBy(String search, Pageable pageable){
        Page<ScheduleEntity> scheduleEntities = Filter.builder(ScheduleEntity.class, entityManager)
                .filter()
                .isEqual("scheduleTitle", search)
                .getPage(pageable);
        return scheduleEntities.map(scheduleEntity -> new IdAndName(scheduleEntity.getId(), scheduleEntity.getScheduleTitle()));
    }

    @Transactional(readOnly = true)
    public Page<IdAndName> getCandidatesBy(String search, Pageable pageable){
        Page<CandidateEntity> candidateEntities = Filter.builder(CandidateEntity.class, entityManager)
                .filter()
                .isEqual("fullName", search)
                .getPage(pageable);
        return candidateEntities.map(candidateEntity -> new IdAndName(candidateEntity.getId(), candidateEntity.getFullName()));
    }

    @Transactional(readOnly = true)
    public Page<LevelEntity> getLevelsBy(String search, Pageable pageable){
        return Filter.builder(LevelEntity.class, entityManager)
                .filter()
                .isEqual("name", search)
                .getPage(pageable);
    }

    @Transactional(readOnly = true)
    public Page<DepartmentEntity> getDepartmentsBy(String search, Pageable pageable){
        return Filter.builder(DepartmentEntity.class, entityManager)
                .filter()
                .isEqual("name", search)
                .getPage(pageable);
    }

    @Transactional(readOnly = true)
    public Page<ContractTypeEntity> getContractsBy(String search, Pageable pageable){
        return Filter.builder(ContractTypeEntity.class, entityManager)
                .filter()
                .isEqual("name", search)
                .getPage(pageable);
    }

    @Transactional(readOnly = true)
    public Page<PositionEntity> getPositionsBy(String search, Pageable pageable){
        return Filter.builder(PositionEntity.class, entityManager)
                .filter()
                .isEqual("name", search)
                .getPage(pageable);
    }

    @Transactional(readOnly = true)
    public Page<IdAndName> getAccountsBy(String search, String role, Pageable pageable){
        Page<AccountEntity> accountEntities = Filter.builder(AccountEntity.class, entityManager)
                .filter()
                .isEqual("fullName", search)
                .isEqual("role", role)
                .getPage(pageable);
        return accountEntities.map(accountEntity ->
                new IdAndName(
                        accountEntity.getId(), accountEntity.getFullName()
                ));
    }
}

package fa.training.HN24_CPL_JAVA_01_G3.repository.benefit;

import fa.training.HN24_CPL_JAVA_01_G3.entity.BenefitEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface BenefitRepository extends JpaRepository<BenefitEntity, Long> {
    List<BenefitEntity> findAllByIdIn(Collection<Long> ids);
    List<BenefitEntity> findBenefitEntitiesByNameIn(List<String> names);
}

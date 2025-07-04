package fa.training.HN24_CPL_JAVA_01_G3.repository.skill;

import fa.training.HN24_CPL_JAVA_01_G3.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Long> {
    List<SkillEntity> findAllByIdIn(Collection<Long> ids);
    List<SkillEntity> findSkillEntitiesByNameIn(List<String> names);
}

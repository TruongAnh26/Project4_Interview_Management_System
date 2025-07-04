package fa.training.HN24_CPL_JAVA_01_G3.repository.level;

import fa.training.HN24_CPL_JAVA_01_G3.entity.LevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LevelRepository extends JpaRepository<LevelEntity, Long> {
    List<LevelEntity> findAllByIdIn(Collection<Long> ids);
    List<LevelEntity> findLevelEntitiesByNameIn(List<String> names);
}

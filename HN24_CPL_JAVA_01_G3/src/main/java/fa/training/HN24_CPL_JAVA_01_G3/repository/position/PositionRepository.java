package fa.training.HN24_CPL_JAVA_01_G3.repository.position;

import fa.training.HN24_CPL_JAVA_01_G3.entity.PositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<PositionEntity, Long> {
}

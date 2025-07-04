package fa.training.HN24_CPL_JAVA_01_G3.repository.job_skill_map;

import fa.training.HN24_CPL_JAVA_01_G3.entity.JobSkillMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobSkillMapRepository extends JpaRepository<JobSkillMapEntity, Long> {
    List<JobSkillMapEntity> findAllByJobId(Long jobId);
    void deleteJobSkillMapEntitiesByJobId(Long jobId);
}

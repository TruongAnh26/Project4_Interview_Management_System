package fa.training.HN24_CPL_JAVA_01_G3.repository.job_level_map;

import fa.training.HN24_CPL_JAVA_01_G3.entity.JobLevelMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobLevelMapRepository extends JpaRepository<JobLevelMapEntity, Long> {
    List<JobLevelMapEntity> findJobLevelMapEntitiesByJobId(Long jobId);
    void deleteJobLevelMapEntitiesByJobId(Long jobId);
}

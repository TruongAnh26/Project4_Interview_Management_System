package fa.training.HN24_CPL_JAVA_01_G3.repository.job_benefit_map;

import fa.training.HN24_CPL_JAVA_01_G3.entity.JobBenefitMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobBenefitMapRepository extends JpaRepository<JobBenefitMapEntity, Long> {
    List<JobBenefitMapEntity> findAllByJobId(Long jobId);
    void deleteJobBenefitMapEntitiesByJobId(Long jobId);
}

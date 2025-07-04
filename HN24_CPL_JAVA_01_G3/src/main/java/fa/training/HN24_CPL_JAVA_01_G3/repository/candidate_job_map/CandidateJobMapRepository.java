package fa.training.HN24_CPL_JAVA_01_G3.repository.candidate_job_map;

import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;


@Repository
public interface CandidateJobMapRepository extends JpaRepository<CandidateJobMapEntity, Long> {

    @Query("SELECT csm FROM CandidateJobMapEntity csm Where csm.candidateEntity.id = :candidateId and csm.JobEntity.id = :jobId")
    CandidateJobMapEntity findByCandidateIdAndJobId(Long candidateId, Long jobId);
    @Query("SELECT csm FROM CandidateJobMapEntity csm Where csm.candidateEntity.id = :candidateId and csm.status like 'Opened'")
    List<CandidateJobMapEntity> findJobsByCandidateIdAndStatus(@Param("candidateId") Long candidateId);
    @Query("SELECT csm FROM CandidateJobMapEntity csm Where csm.candidateEntity.id In ?1 and csm.status like 'Opened'")
    List<CandidateJobMapEntity> findAllJobsByCandidateIdAndStatus(Collection<Long> candidateIds);


    @Modifying
    @Query("DELETE FROM CandidateJobMapEntity cjm WHERE cjm.candidateEntity.id = :candidateId")
    void deleteByCandidateId(@Param("candidateId") Long candidateId);

    @Query("SELECT cjm.JobEntity FROM CandidateJobMapEntity cjm Where cjm.candidateEntity.id = :candidateId")
    List<JobEntity> findJobByCandidateId(@Param("candidateId") Long candidateId);
}

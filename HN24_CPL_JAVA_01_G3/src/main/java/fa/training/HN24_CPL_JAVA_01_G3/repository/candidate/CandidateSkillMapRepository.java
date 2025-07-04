package fa.training.HN24_CPL_JAVA_01_G3.repository.candidate;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateSkillMapEntity;
import fa.training.HN24_CPL_JAVA_01_G3.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CandidateSkillMapRepository extends JpaRepository<CandidateSkillMapEntity, Long> {
    @Query("SELECT csm.skillEntity FROM CandidateSkillMapEntity csm Where csm.candidateEntity.id = :candidateId")
    List<SkillEntity> findSkillByCandidateId(@Param("candidateId") Long candidateId);

    @Modifying
    @Query("DELETE FROM CandidateSkillMapEntity csm WHERE csm.candidateEntity.id = :candidateId")
    void deleteByCandidateId(@Param("candidateId") Long candidateId);
    void deleteAllByCandidateEntityId(Long candidateId);
    @Query("SELECT csm FROM CandidateSkillMapEntity csm Where csm.candidateEntity.id = :candidateId and csm.status like 'Opened'")
    List<CandidateSkillMapEntity> findSkillByCandidateIdAndStatus(@Param("candidateId") Long candidateId);
//    @Query("select u from CandidateSkillMapEntity  u where u.candidateEntity.id = :ids")
//    List<CandidateSkillMapEntity> findAllByCandidateId(List<Long> ids);
}

package fa.training.HN24_CPL_JAVA_01_G3.repository.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleInterviewerMapEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ScheduleInteviewerMapRepository extends JpaRepository<ScheduleInterviewerMapEntity, Long> {
    void deleteAllByScheduleId(Long scheduleId);
    List<ScheduleInterviewerMapEntity> findByScheduleIdIn(List<Long> scheduleIds);

    List<ScheduleInterviewerMapEntity> findAllByScheduleIdIn(Collection<Long> scheduleIds);

    List<ScheduleInterviewerMapEntity> findAllByScheduleId(Long scheduleId);

    List<ScheduleInterviewerMapEntity> findAllByInterviewerId(Long interviewId);
}

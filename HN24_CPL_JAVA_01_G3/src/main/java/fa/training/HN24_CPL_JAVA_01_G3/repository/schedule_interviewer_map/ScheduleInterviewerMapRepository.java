package fa.training.HN24_CPL_JAVA_01_G3.repository.schedule_interviewer_map;

import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleInterviewerMapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleInterviewerMapRepository extends JpaRepository<ScheduleInterviewerMapEntity, Long> {
    List<ScheduleInterviewerMapEntity> findAllByScheduleId(Long scheduleId);
}

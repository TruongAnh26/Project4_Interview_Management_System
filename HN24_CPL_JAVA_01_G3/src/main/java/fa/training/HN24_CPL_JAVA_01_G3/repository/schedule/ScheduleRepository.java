package fa.training.HN24_CPL_JAVA_01_G3.repository.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {
    List<ScheduleEntity> findAllByStatus(String status);
    @Query("SELECT s FROM ScheduleEntity s WHERE s.scheduleTime >= :startOfTomorrow AND s.scheduleTime < :startOfDayAfterTomorrow")
    List<ScheduleEntity> findSchedulesForTomorrow(@Param("startOfTomorrow") OffsetDateTime startOfTomorrow,
                                                  @Param("startOfDayAfterTomorrow") OffsetDateTime startOfDayAfterTomorrow);
}

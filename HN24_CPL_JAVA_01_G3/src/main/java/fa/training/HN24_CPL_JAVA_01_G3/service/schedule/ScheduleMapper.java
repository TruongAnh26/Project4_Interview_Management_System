package fa.training.HN24_CPL_JAVA_01_G3.service.schedule;

import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.*;
import fa.training.HN24_CPL_JAVA_01_G3.entity.ScheduleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper
public interface ScheduleMapper {

    ScheduleEntity getEtEntityFromRequest(ScheduleRequest scheduleRequest);
    void updateEntity(@MappingTarget ScheduleEntity scheduleEntity, UpdateScheduleRequest updateScheduleRequest);
    ScheduleResponse getResponseFrom(ScheduleEntity scheduleEntity);

    DetailScheduleResponse getDetailResponseFrom(ScheduleEntity scheduleEntity);

    void updateInterviewResult(@MappingTarget ScheduleEntity scheduleEntity, ResultInterviewRequest resultInterviewRequest);
}

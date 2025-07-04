package fa.training.HN24_CPL_JAVA_01_G3.validation;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.ScheduleRequest;
import fa.training.HN24_CPL_JAVA_01_G3.dto.schedule.UpdateScheduleRequest;

import java.time.OffsetDateTime;

public class ScheduleValidateHelper {
    public static void createValidate(ScheduleRequest scheduleRequest){
        validateDate(scheduleRequest, CodeAndMessage.ME021);
    }

    public static void updateValidate(UpdateScheduleRequest updateScheduleRequest){
        validateDate(updateScheduleRequest, CodeAndMessage.ME013);
    }


    private static void validateDate(ScheduleRequest scheduleRequest, String errorCode){
        if (scheduleRequest.getTimeStart().isAfter(scheduleRequest.getTimeEnd())
                || scheduleRequest.getTimeStart().isEqual(scheduleRequest.getTimeEnd())){
            throw new RuntimeException(errorCode);
        }
        if (OffsetDateTime.now().isAfter(scheduleRequest.getScheduleTime())){
            throw new RuntimeException(errorCode);
        }
    }
    private static void validateDate(UpdateScheduleRequest updateScheduleRequest, String errorCode){
        if (updateScheduleRequest.getTimeStart().isAfter(updateScheduleRequest.getTimeEnd())
                || updateScheduleRequest.getTimeStart().isEqual(updateScheduleRequest.getTimeEnd())){
            throw new RuntimeException(errorCode);
        }
        if (OffsetDateTime.now().isAfter(updateScheduleRequest.getScheduleTime())){
            throw new RuntimeException(errorCode);
        }
    }
}

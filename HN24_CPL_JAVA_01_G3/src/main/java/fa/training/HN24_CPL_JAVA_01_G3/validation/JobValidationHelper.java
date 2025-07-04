package fa.training.HN24_CPL_JAVA_01_G3.validation;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.dto.job.JobRequest;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

public class JobValidationHelper {
    public static void createValidate(JobRequest jobRequest) {
        validateFillAllRequiredField(jobRequest);
        validateDateToCreate(jobRequest);
    }

    public static void updateValidate(JobRequest jobRequest) {
        validateFillAllRequiredField(jobRequest);
        validateDateToUpdate(jobRequest);
    }

    private static void validateDateToCreate(JobRequest jobRequest) {
        if (jobRequest.getStartDate().isAfter(jobRequest.getEndDate())
                || jobRequest.getStartDate().isEqual(jobRequest.getEndDate())) {
            throw new RuntimeException(CodeAndMessage.ME018);
        }
        if (OffsetDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDate().atStartOfDay().atOffset(ZoneOffset.UTC).isAfter(jobRequest.getStartDate())) {
            throw new RuntimeException(CodeAndMessage.ME017);
        }
    }

    private static void validateDateToUpdate(JobRequest jobRequest) {
        if (jobRequest.getStartDate().isAfter(jobRequest.getEndDate())
                || jobRequest.getStartDate().isEqual(jobRequest.getEndDate())) {
            throw new RuntimeException(CodeAndMessage.ME018);
        }
    }

    public static void validateFillAllRequiredField(JobRequest jobRequest) {
        if (jobRequest.getJobTitle().isEmpty() ||
                jobRequest.getSkillIds().isEmpty() ||
                jobRequest.getStartDate() == null ||
                jobRequest.getEndDate() == null ||
                jobRequest.getLevelIds().isEmpty() ||
                jobRequest.getBenefitIds().isEmpty()) {
            throw new RuntimeException(CodeAndMessage.ME002);
        }
    }
}

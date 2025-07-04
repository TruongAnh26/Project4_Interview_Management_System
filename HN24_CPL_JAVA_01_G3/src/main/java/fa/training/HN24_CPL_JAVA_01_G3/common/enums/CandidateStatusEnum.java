package fa.training.HN24_CPL_JAVA_01_G3.common.enums;

public enum CandidateStatusEnum {
    STATUS_OPEN("Open"),
    STATUS_OPENED("Opened"),
    STATUS_WAITING_FOR_INTERVIEW("Waiting_for_interview"),
    STATUS_CANCELLED_INTERVIEW("Cancelled_interview"),
    STATUS_PASSED_INTERVIEW("Passed_interview"),
    STATUS_FAILED_INTERVIEW("Failed_inter"),
    STATUS_WAITING_FOR_APPROVAL("Waiting_for_approval"),
    STATUS_APPROVED_OFFER("Approved_offer"),
    STATUS_REJECTED_OFFER("Rejected_offer"),
    STATUS_WAITING_FOR_RESPONSE("Waiting_for_response"),
    STATUS_ACCEPTED_OFFER("Accepted_offer"),
    STATUS_DECLINED_OFFER("Declined_offer"),
    STATUS_CANCELLED_OFFER("Cancelled_offer"),
    STATUS_BANNED("Banned");

    private final String status;

    CandidateStatusEnum(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}

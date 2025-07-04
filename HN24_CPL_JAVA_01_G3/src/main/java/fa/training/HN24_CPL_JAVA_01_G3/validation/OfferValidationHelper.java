package fa.training.HN24_CPL_JAVA_01_G3.validation;

import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;
import fa.training.HN24_CPL_JAVA_01_G3.entity.OfferEntity;

import java.time.OffsetDateTime;

public class OfferValidationHelper {
    public static void createValidate(OfferRequest offerRequest){
        validateDate(offerRequest, CodeAndMessage.ME023);
    }

    public static void updateValidate(OfferRequest offerRequest, OfferEntity offerEntity){
        validateDate(offerRequest, CodeAndMessage.ME013);
        validateStatusWhenUpdate(offerEntity, CodeAndMessage.ME013);
    }

    public static void approveValidate(OfferEntity offerEntity, String errorCode){
        validateStatusNotEqualWaitingForApproval(offerEntity, errorCode);
    }

    public static void rejectValidate(OfferEntity offerEntity, String errorCode){
        validateStatusNotEqualWaitingForApproval(offerEntity, errorCode);
    }

    public static void acceptValidate(OfferEntity offerEntity, String errorCode){
        if (!OfferStatusEnum.WAITING_FOR_RESPONSE.name().equals(offerEntity.getStatus())){
            throw new RuntimeException(errorCode);
        }
    }

    public static void declineValidate(OfferEntity offerEntity, String errorCode){
        if (!OfferStatusEnum.WAITING_FOR_RESPONSE.name().equals(offerEntity.getStatus())){
            throw new RuntimeException(errorCode);
        }
    }

    public static void cancelValidate(OfferEntity offerEntity, String errorCode){
        if (!OfferStatusEnum.APPROVED.name().equals(offerEntity.getStatus())
                && !OfferStatusEnum.WAITING_FOR_RESPONSE.name().equals(offerEntity.getStatus())
                && !OfferStatusEnum.ACCEPTED.name().equals(offerEntity.getStatus())){
            throw new RuntimeException(errorCode);
        }
    }

    private static void validateStatusWhenUpdate(OfferEntity offerEntity, String errorCode){
        if (!OfferStatusEnum.WAITING_FOR_APPROVAL.name().equals(offerEntity.getStatus())){
            throw new RuntimeException(errorCode);
        }
    }

    private static void validateStatusNotEqualWaitingForApproval(OfferEntity offerEntity, String errorCode){
        if (!OfferStatusEnum.WAITING_FOR_APPROVAL.name().equals(offerEntity.getStatus())){
            throw new RuntimeException(errorCode);
        }
    }

    private static void validateDate(OfferRequest offerRequest, String errorCode){
        if (offerRequest.getFrom().isAfter(offerRequest.getTo()) || offerRequest.getFrom().isEqual(offerRequest.getTo())){
            throw new RuntimeException(errorCode);
        }
        if (OffsetDateTime.now().isAfter(offerRequest.getDueDate())){
            throw new RuntimeException(errorCode);
        }
    }
}

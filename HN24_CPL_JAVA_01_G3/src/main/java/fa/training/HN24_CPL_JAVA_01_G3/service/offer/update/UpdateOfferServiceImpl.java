package fa.training.HN24_CPL_JAVA_01_G3.service.offer.update;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.TokenHelper;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.CodeAndMessage;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessHandle;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.CandidateStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.common.enums.OfferStatusEnum;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.InterviewForUpdateOfferResponse;
import fa.training.HN24_CPL_JAVA_01_G3.dto.offer.OfferRequest;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.account.AccountJPARepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.candidate.CandidateRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.CustomRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.offer.OfferRepository;
import fa.training.HN24_CPL_JAVA_01_G3.repository.schedule_interviewer_map.ScheduleInterviewerMapRepository;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.OfferMapper;
import fa.training.HN24_CPL_JAVA_01_G3.service.offer.update_offer_state.UpdateOfferState;
import fa.training.HN24_CPL_JAVA_01_G3.validation.OfferValidationHelper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UpdateOfferServiceImpl implements UpdateOfferService {
    private final OfferRepository offerRepository;
    private final OfferMapper offerMapper;
    private final CustomRepository customRepository;
    private final ScheduleInterviewerMapRepository scheduleInterviewerMapRepository;
    private final AccountJPARepository accountJPARepository;
    private final Map<String, UpdateOfferState> updateOfferStateMap;
    private final SetStateWhenUpdateOfferHelper setStateWhenUpdateOfferHelper;
    private final CandidateRepository candidateRepository;

    @Override
    @Transactional
    public SuccessResponse createOffer(String accessToken, OfferRequest offerRequest) {
        OfferValidationHelper.createValidate(offerRequest);
        OfferEntity offerEntity = offerMapper.getEntityBy(offerRequest);
        setRecruiterForOffer(accessToken, offerEntity);
        setInterviewInfoForOffer(offerRequest, offerEntity);
        setStatusForOfferWhenCreate(offerEntity);
        offerRepository.save(offerEntity);
        // set Candidate's status = WAITING FOR APPROVAL
        setStateWhenUpdateOfferHelper.setStateForCandidate(
                offerEntity.getCandidateId(), CandidateStatusEnum.STATUS_WAITING_FOR_APPROVAL.getStatus()
        );
        return SuccessHandle.success(CodeAndMessage.ME024);
    }

    @Override
    @Transactional
    public SuccessResponse updateOffer(String accessToken, Long id, OfferRequest offerRequest) {
        OfferEntity offerEntity = customRepository.getOfferEntityBy(id);
        offerMapper.updateEntityBy(offerEntity, offerRequest);
        OfferValidationHelper.updateValidate(offerRequest, offerEntity);
        setRecruiterForOffer(accessToken, offerEntity);
        setInterviewInfoForOffer(offerRequest, offerEntity);
        offerRepository.save(offerEntity);
        return SuccessHandle.success(CodeAndMessage.ME014);
    }

    @Override
    @Transactional
    public SuccessResponse updateStateOffer(String accessToken, Long id, String state) {
        OfferEntity offerEntity = customRepository.getOfferEntityBy(id);
        CandidateEntity candidateEntity = customRepository.getCandidateEntityBy(offerEntity.getCandidateId());
        updateStateForOfferAndCandidate(accessToken, offerEntity, candidateEntity, state);
        return SuccessHandle.success(CodeAndMessage.ME100);
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewForUpdateOfferResponse getInterviewInfoBy(Long id) {
        return getInterviewInfoForOffer(id);
    }

    private void updateStateForOfferAndCandidate(String accessToken, OfferEntity offerEntity,
                                                 CandidateEntity candidateEntity, String state) {
        UpdateOfferState updateOfferState = updateOfferStateMap.get(state);
        updateOfferState.updateState(accessToken, offerEntity, candidateEntity);
        offerRepository.save(offerEntity);
        candidateRepository.save(candidateEntity);
    }

    private void setRecruiterForOffer(String accessToken, OfferEntity offerEntity) {
        if (Objects.isNull(offerEntity.getRecruiterId())) {
            offerEntity.setRecruiterId(TokenHelper.getUserIdFromToken(accessToken));
        }
    }

    private void setStatusForOfferWhenCreate(OfferEntity offerEntity) {
        offerEntity.setStatus(OfferStatusEnum.WAITING_FOR_APPROVAL.name());
    }

    private void setInterviewInfoForOffer(OfferRequest offerRequest, OfferEntity offerEntity) {
        InterviewForUpdateOfferResponse interview = getInterviewInfoForOffer(offerRequest.getScheduleId());
        offerEntity.setInterview(interview.getInterviewName());
        offerEntity.setInterviewers(interview.getInterviewers());
    }

    private InterviewForUpdateOfferResponse getInterviewInfoForOffer(Long scheduleId) {
        ScheduleEntity scheduleEntity = customRepository.getScheduleEntityBy(scheduleId);
        List<AccountEntity> interviewers = accountJPARepository.findAllByIdIn(
                scheduleInterviewerMapRepository.findAllByScheduleId(scheduleEntity.getId()).stream()
                        .map(ScheduleInterviewerMapEntity::getInterviewerId)
                        .distinct().collect(Collectors.toList())
        );
        StringBuilder interviewerString = new StringBuilder();
        for (AccountEntity account : interviewers) {
            interviewerString.append(account.getFullName()).append(", ");
        }
        interviewerString.delete(interviewerString.length() - 2, interviewerString.length());
//        offerEntity.setInterviewers(new String(interviewerString));
        return new InterviewForUpdateOfferResponse(
                scheduleEntity.getScheduleTitle(),
                new String(interviewerString), scheduleEntity.getNotes()
        );
    }
}

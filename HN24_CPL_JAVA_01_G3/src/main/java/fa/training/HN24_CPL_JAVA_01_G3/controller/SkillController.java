package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.dto.skill.SkillCandidateResponse;
import fa.training.HN24_CPL_JAVA_01_G3.entity.CandidateSkillMapEntity;
import fa.training.HN24_CPL_JAVA_01_G3.service.skill.SkillService;
import fa.training.HN24_CPL_JAVA_01_G3.service.skill.SkillServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/skill")
@AllArgsConstructor
public class SkillController {

    private final SkillService skillService;
    @GetMapping("/list")
    public SkillCandidateResponse getCandidateMapSkill(
            @RequestHeader String accessToken,
            @RequestParam Long candidateId){
        return skillService.getByCandidateId(accessToken, candidateId);
    }



}

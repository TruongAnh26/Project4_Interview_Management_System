package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.filter.Filter;
import fa.training.HN24_CPL_JAVA_01_G3.common.IdAndName;
import fa.training.HN24_CPL_JAVA_01_G3.entity.*;
import fa.training.HN24_CPL_JAVA_01_G3.repository.custom.MasterDataRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/master-data")
@AllArgsConstructor
@CrossOrigin
public class MasterDataController {
    private final MasterDataRepository masterDataRepository;

    @GetMapping("/interview")
    @Operation(summary = "Lấy danh sách interview")
    public Page<IdAndName> getScheduleBy(@RequestParam(required = false) String search,
                                         @ParameterObject Pageable pageable) {
        return masterDataRepository.getScheduleBy(search, pageable);
    }

    @GetMapping("/candidate")
    @Operation(summary = "Lấy danh sách candidate")
    public Page<IdAndName> getCandidatesBy(@RequestParam(required = false) String search,
                                           @ParameterObject Pageable pageable) {
        return masterDataRepository.getCandidatesBy(search, pageable);
    }

    @GetMapping("/level")
    @Operation(summary = "Lấy danh sách level")
    public Page<LevelEntity> getLevelsBy(@RequestParam(required = false) String search,
                                         @ParameterObject Pageable pageable) {
        return masterDataRepository.getLevelsBy(search, pageable);
    }

    @GetMapping("/department")
    @Operation(summary = "Lấy danh sách department")
    public Page<DepartmentEntity> getDepartmentsBy(@RequestParam(required = false) String search,
                                                   @ParameterObject Pageable pageable) {
        return masterDataRepository.getDepartmentsBy(search, pageable);
    }

    @GetMapping("/contract")
    @Operation(summary = "Lấy danh sách contract")
    public Page<ContractTypeEntity> getContractsBy(@RequestParam(required = false) String search,
                                                   @ParameterObject Pageable pageable) {
        return masterDataRepository.getContractsBy(search, pageable);
    }

    @GetMapping("/position")
    @Operation(summary = "Lấy danh sách position")
    public Page<PositionEntity> getPositionsBy(@RequestParam(required = false) String search,
                                               @ParameterObject Pageable pageable) {
        return masterDataRepository.getPositionsBy(search, pageable);
    }

    @GetMapping("/user")
    @Operation(summary = "Lấy danh sách user")
    public Page<IdAndName> getAccountsBy(@RequestParam(required = false) String search,
                                         @RequestParam(required = false) String role,
                                         @ParameterObject Pageable pageable) {
        return masterDataRepository.getAccountsBy(search, role, pageable);
    }
}

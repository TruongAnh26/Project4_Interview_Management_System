package fa.training.HN24_CPL_JAVA_01_G3.controller;

import fa.training.HN24_CPL_JAVA_01_G3.base.authen.AuthenticationProxy;
import fa.training.HN24_CPL_JAVA_01_G3.base.error_success_handle.SuccessResponse;
import fa.training.HN24_CPL_JAVA_01_G3.common.Common;
import fa.training.HN24_CPL_JAVA_01_G3.dto.account.*;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.get.GetAccountService;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.reset_account.ResetAccountService;
import fa.training.HN24_CPL_JAVA_01_G3.service.account.update.UpdateAccountService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/account")
@AllArgsConstructor
@CrossOrigin
public class AccountController {
    private final UpdateAccountService updateAccountService;
    private final GetAccountService getAccountService;
    private final ResetAccountService resetAccountService;

    @PostMapping("/sign-up")
    @Operation(summary = "Tạo mới user - UC33")
    public SuccessResponse signUp(@RequestBody @Valid SignUpRequest signUpRequestV2) {
        return updateAccountService.signUp(signUpRequestV2);
    }

    @PostMapping("/sign-in")
    @Operation(summary = "Đăng nhập")
    public TokenAndRole logIn(@RequestBody @Valid SignInRequest signInRequest) {
        return updateAccountService.logIn(signInRequest);
    }

    @PutMapping
    @Operation(summary = "Chỉnh sửa user - UC35")
    @AuthenticationProxy(acceptRoles = {"ADMIN"})
    public SuccessResponse updateAccount(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                         @RequestParam Long id,
                                         @RequestBody @Valid UpdateAccountRequest updateAccountRequest) {
        return updateAccountService.updateAccount(accessToken, id, updateAccountRequest);
    }

    @PutMapping("/status")
    @Operation(summary = "Cập nhật trạng thái user - UC36")
    @AuthenticationProxy(acceptRoles = {"ADMIN"})
    public void updateStatusForAccount(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                       @RequestParam Long id,
                                       @RequestParam String status) {
        updateAccountService.updateStatusForAccount(accessToken, id, status);
    }

    @PostMapping("/log-out")
    @Operation(summary = "Đăng xuất khỏi trái đất")
    public SuccessResponse logOut(@RequestHeader(Common.AUTHORIZATION) String accessToken) {
        return updateAccountService.logOut(accessToken);
    }

    @GetMapping
    @Operation(summary = "Xem chi tiết user - UC34")
    @AuthenticationProxy(acceptRoles = {"ADMIN"})
    public AccountDetailResponse getAccount(@RequestHeader(Common.AUTHORIZATION) String accessToken,
                                            @RequestParam Long id) {
        return getAccountService.getAccount(id);
    }

    @GetMapping("/check-exists-account")
    @Operation(summary = "Kiểm tra xem có tồn tại username này hay không - Reset Password step1")
    public SuccessResponse isExistsUsername(@RequestParam String username) {
        return resetAccountService.isExistsUsername(username);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Quên password - Reset Password step2")
    public ForgotPasswordResponse forgotPassword(@RequestParam String username,
                                                 @RequestParam String email) {
        return resetAccountService.forgotPassword(username, email);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset lại password - Reset Password step3")
    public SuccessResponse resetPassword(Long userId, Integer otp) {
        return resetAccountService.resetPassword(userId, otp);
    }

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách user - UC32")
    public Page<AccountListResponse> getAccountsBy(@RequestParam(required = false) String search,
                                                   @RequestParam(required = false) String role,
                                                   @ParameterObject Pageable pageable) {
        return getAccountService.getAccountsBy(search, role, pageable);
    }
}

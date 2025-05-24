const local = 'http://127.0.0.1:8000/';
const live = 'https://dev-api.lotto60.com/';
export class ConfigService {
  //domian url

  public Domain = local;

  //base

  public readonly getBalanceAPI = this.Domain + 'get-balance';
  public readonly getLedgerAPI = this.Domain + 'ledger-activities';

  //lobby urls
  public readonly lotto60OriginalsGamesAPI = this.Domain + 'fetch-all-games';
  public readonly featuredThirdPartyGamesAPI =
    this.Domain + 'get-featured-third-party-games';

  public readonly getAllThirdPartyGamesCategoriesAPI =
    this.Domain + 'fetch-all-third-party-games-categories';

  public readonly getThirdPartyGamesSearchAPI =
    this.Domain + 'fetch-all-third-party-games';

  // auth urls

  public readonly getCurrenciesAPI = this.Domain + 'get-currencies';
  public readonly loginAPI = this.Domain + 'auth/login';
  public readonly signupAPI = this.Domain + 'signup';

  public readonly forgotPasswordAPI = this.Domain + 'auth/forget-password';
  public readonly resetPasswordAPI = this.Domain + 'auth/reset-password';
  public readonly verifyEmailAPI = this.Domain + 'auth/init-email-verification';
  public readonly verifyEmailTokenAPI = this.Domain + 'auth/email-verification';
  public readonly verifyTFAAPI = this.Domain + 'auth/verify-tfa';
  public readonly usernameCheckAPI = this.Domain + 'check-username';

  // profile

  public readonly getProfileAPI = this.Domain + 'profile';
  public readonly updateProfileAPI = this.Domain + 'profile/update-profile';

  public readonly changePasswordAPI = this.Domain + 'profile/change-password';
  // 2fa
  public readonly get2FAQRAPI = this.Domain + 'profile/generate-tfa-creds';
  public readonly profileVerifyTFAAPI = this.Domain + 'profile/verify-tfa';
  public readonly disableTFAAPI = this.Domain + 'profile/disable-two-factor';

  public readonly createKYCAPI = this.Domain + 'create-veriff-sessions';

  // bank

  public readonly fetchFiatPaymentMethodsAPI =
    this.Domain + 'fiat/fetch-payment-methods/deposit';

  public readonly fetchCryptoPaymentMethodsAPI =
    this.Domain + 'crypto/fetch-payment-methods/deposit';
}
 
export const AppConfig = {
  apiUrl: 'http://3.142.49.117:8080/account-API/api',
  apiVerifyStatus: 'http://3.142.49.117:8080/account-API/api/cuenta/verificar-estatus',
  apiCreateAccount: 'http://3.142.49.117:8080/account-API/api/cuenta/crear-cuenta',
  apiSeguriDataSign: 'https://feb.seguridata.com/ssignrest/user?',
  apiSeguriDataMultilateral: 'https://feb.seguridata.com/ssignrest/multilateral/',
  apiSeguriDataMultilateralGetHash: 'https://feb.seguridata.com/ssignrest/multilateral/getHash/',
  apiSeguriDataSignWiHash: 'https://feb.seguridata.com/ws-rest-seguritools_Firma_pkcs7/signWithHash?doPKCS7=true',
  apiSeguriDataMultilateralUpdate: 'https://feb.seguridata.com/ssignrest/multilateral/update/',
  apiSeguriDataFinalize: 'https://feb.seguridata.com/ssignrest/multilateral/finalize/',
  apiSeguriDataGetStatus: 'https://feb.seguridata.com/ssignrest/multilateral/status/',
  apiSeguriDataWriteSignature: 'https://feb.seguridata.com/ssignrest/multilateral/writtenSignature/'
};

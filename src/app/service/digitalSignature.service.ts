import { Injectable } from '@angular/core';
import * as pkijs from "pkijs";
import { fromBER } from "asn1js";
import { CookieService } from 'ngx-cookie-service';

declare function arrayBufferToString(params:ArrayBuffer) : any;
declare function pkcs7FromHash(password: string, cipheredKey: string, certX509: string, hashAlgorithm: string, hashToSign: string, flag: boolean): Promise<string>;
declare function openOldKey(cipheredKey: string, password: string): string;
declare function signHash_2(hashToSign: string, hashAlgorithm: string, cert: string, result: string, password: string, flag: boolean): string;

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const hexParts: string[] = [];
  byteArray.forEach((byte) => {
    const hex = byte.toString(16).padStart(2, "0");
    hexParts.push(hex);
  });
  return hexParts.join("");
}


function formatSerialNumber(hex: string): string {
  return hex.toUpperCase();
}


@Injectable({
  providedIn: 'root'
})

export class AuthDigitalSign {
  signature: string = '';
  result1: string = '';
  constructor(private cookieService: CookieService) { }

  async getCertificateInfo(file: File): Promise<{ serialNumber: string; }> {
    const arrayBuffer = await file.arrayBuffer();
    const asn1 = fromBER(arrayBuffer);
    const certificate = new pkijs.Certificate({ schema: asn1.result });

    const serialNumber = formatSerialNumber(arrayBufferToHex(certificate.serialNumber.valueBlock.valueHex));

    return { serialNumber };
  }

  readBase64(file: File): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener('load', function () {
        resolve(reader.result);
      }, false);
      reader.addEventListener('error', function (event) {
        reject(event);
      }, false);

      reader.readAsDataURL(file);
    });
    return future;
    }



  getSignature(data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let HashPdf = JSON.parse(this.cookieService.get('getHash'));

      if (!data.userPk) {
        alert('You must enter private key password');
        return reject('You must enter private key password');
      }

      if (data.privateKeyBuffer.byteLength === 0) {
        alert("You must select signer's private key");
        return reject("You must select signer's private key");
      }

      if (data.certificateBuffer.byteLength === 0) {
        alert("You must select signer's certificate");
        return reject("You must select signer's certificate");
      }

      if (!HashPdf) {
        alert('You must enter hash to sign');
        return reject('You must enter hash to sign');
      }

      const privateKeyBufferString = arrayBufferToString(data.privateKeyBuffer);
      const pKey = privateKeyBufferString.replace(/(-----(BEGIN|END) PRIVATE KEY-----|\r\n)/g, '');
      const cipheredKey = pKey.charAt(0) === 'M' ? window.atob(pKey) : privateKeyBufferString;

      const certificateBufferString = arrayBufferToString(data.certificateBuffer);
      const pCert = certificateBufferString.replace(/(-----(BEGIN|END) CERTIFICATE-----|\r\n)/g, '');
      const certX509 = pCert.charAt(0) === 'M' ? window.atob(pCert) : certificateBufferString;



      try {
        if (window.Promise) {
          const signPromise = pkcs7FromHash(data.userPkp, cipheredKey, certX509, data.hashAlgorithm, HashPdf, true);
          signPromise.then((Signature: string) => {
            this.signature = Signature;
            resolve(this.signature);
          }).catch((error: string) => {
            if (error.indexOf('Unexpected format or file') !== -1) {
              this.result1 = openOldKey(cipheredKey, data.userPkp);
              if (this.result1.indexOf('Error') !== -1) {
                alert('[SgDataCrypto] - ' + this.result1);
                this.signature = '';
                reject(this.result1);
              } else {
                this.result1 = signHash_2(HashPdf, data.hashAlgorithm, btoa(certX509), this.result1, data.userPkp, true);
                if (this.result1.indexOf('Error') !== -1) {
                  alert('[SgDataCrypto] - ' + this.result1);
                  this.signature = '';
                  reject(this.result1);
                } else {
                  this.signature = this.result1;
                  resolve(this.signature);
                }
              }
            } else {
              alert('[SgDataCrypto] - ' + error);
              this.signature = '';
              reject(error);
            }
          });
        } else {
          alert('Your current browser does not support Promises! This page will not work.');
          reject('Your current browser does not support Promises!');
        }
      } catch (err: any) {
        alert('[SgDataCrypto] - ' + err.message + '\n' + err.stack);
        reject(err);
      }
    });
  }


  b64toBlob(b64Data: string, contentType: string) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getFile(b64: string,fileName: string) {
    var blob = this.b64toBlob(b64, "application/pdf");
    console.log("Blob de archivo ===> ",blob)
    let a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}

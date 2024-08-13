import { Component, OnInit } from '@angular/core';
import { AuthSeguriData } from '../../service/auth-seguriData.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthDigitalSign } from '../../service/digitalSignature.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.css',
  providers: [CookieService]
})

export class SignatureComponent implements OnInit{
  privateKeyBuffer: ArrayBuffer = new ArrayBuffer(0);
  certificateBuffer: ArrayBuffer = new ArrayBuffer(0);
  privateKeyFile: File | undefined;
  certificateFile: File | undefined;
  sessionFormSD: FormGroup;
  sessionSignDoc: FormGroup;
  selectedFile: File  | undefined  ;
  certificateSerie: any | undefined;
  pdfName: string = '';
  pdfFile: File | undefined;
  pdfb64: string | undefined;
  getHashBt: boolean | undefined;
  hashAlgorithm: string = '';
  signaturePdf: string = '';
  cerb64: string = '';
  keyb64: string = '';
  cerName: string = '';
  closeFlag: boolean = false;
  signImageb64: string = '';

  constructor(
    public fb: FormBuilder,
    public fbDoc: FormBuilder,
    private authSDService: AuthSeguriData,
    private getSerie: AuthDigitalSign,
    private cookieService: CookieService
  ){
    this.sessionFormSD = this.fb.group({
      userPk: ['',Validators.required],
      userCf: ['',Validators.required],
      userPkp: ['',Validators.required],
      userSignLocation: ['',Validators.required],
      userSignName: ['',Validators.required],
      userSignReason: ['',Validators.required],
      userSignEvType: ['',Validators.required],
      userSignBiData: ['',Validators.required],
      userSignImage: ['',Validators.required]
    })
    this.sessionSignDoc = this.fbDoc.group({
      doc2sign: ['',Validators.required],
      userSigners: ['',Validators.required],
      hashAlg: ['',Validators.required],
      pdfPassword : ['']
    })
  }

  ngOnInit(): void {
    let params = new URLSearchParams()
    this.cookieService.deleteAll()
    params.append('params',JSON.stringify({password:'12121212qw.',user:'qualitas'}))
    this.authSDService.getSessionToken(params.toString()).subscribe(
      response =>{ this.cookieService.set('bearer', response.token.split(' ')[1])}
    )

  }
//Parse to buffer .key to sign with PCKS7
  handleParsingPrivKeyFile(event: any) {
    const file = event.target.files[0];
    this.privateKeyFile = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.privateKeyBuffer = e.target.result;
    };

    reader.readAsArrayBuffer(file);
  }
//Parse to buffer .cer to sign with PCKS7
  handleParsingCertFile(event: any) {
    const file = event.target.files[0];
    //Get serie number of .cer
    this.cerName = file.name;
    if(file){
       this.getSerie.getCertificateInfo(file).then(res => {
        this.certificateSerie = res
       })
    }
    this.certificateFile = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.certificateBuffer = e.target.result;
    };

    reader.readAsArrayBuffer(file);
  }

  hanfleParseImageTob64(event: any){
    const file = event.target.files[0];
    this.getSerie.readBase64(file).then(res =>{
      this.signImageb64 = res.split(',')[1];
    })

  }

  async onPdfSelect(e: any): Promise<void> {
    if(e.target.files.length > 0){
      this.pdfName = e.target.files[0].name
      this.pdfFile = e.target.files[0]
    }

  }

  //Use multilateral proccess to get multilateralID and pdfHash to sign
  async onSubmitFile(){

    const formDataSign = this.sessionSignDoc.value;
    // const jsonData = JSON.stringify(formDataSign);
    this.getSerie.readBase64(this.pdfFile ? this.pdfFile : new File([], 'default.pdf') ).then(async res=> {
      this.pdfb64 = res.split(',')[1];

      let formData = {
        data: this.pdfName,
        document2Sign: {
          base64: true,
          data: this.pdfb64,
          name: this.pdfName
      },
      hashAlg: formDataSign.hashAlg,
      pdfPassword: formDataSign.pdfPassword,
      processType: "PDF",
      totalSigners: formDataSign.userSigners
    }
    //Save totalSigners to verify the document if needs close or not

    //First step get PDF Hash and multilateralId, the process starts
    await this.authSDService.apiSeguriDataMultilateral(JSON.stringify(formData)).subscribe(
      res => {
        //Disable button
        if(res){this.getHashBt = true}
        //Save pdf info in cookie
        if (this.cookieService.get('startMultilateral') ) this.cookieService.delete('startMultilateral')
        this.cookieService.set('startMultilateral', JSON.stringify({'multilateralId':res.multilateralId,'pdfHash': res.hash,'hashAlg':formDataSign.hashAlg}))
      }
    )
    })
  }

  async onSubmitDigitalSign(){
    //Data to get signature to PDF
    const formData = this.sessionFormSD.value;
    //Validate digital sign data
    formData.privateKeyBuffer = this.privateKeyBuffer
    formData.certificateBuffer = this.certificateBuffer
    formData.hashAlgorithm =  JSON.parse(this.cookieService.get('startMultilateral')).hashAlg.toLowerCase()

    //Mapear formData para getHash
    let dataSign : {
      idKey?: number,
      location: string,
      signerName: string,
      signatureReason: string,
      signatureImage: {
        base64: boolean,
        data: string,
        evidenceType: string
      },
      signerCertificate: {
        base64: boolean,
        data: string,
        evidenceType: string
      },
      boxBorder: boolean,
      biometricData?: any;
    }

    //Cer to base64
    this.getSerie.readBase64(this.certificateFile ? this.certificateFile : new File([], 'default.pdf')).then(async res => {
      this.cerb64 = res.split(',')[1];
      //Data to sign PDF
      //If not biometricData delete biometricData,idKey field,
      dataSign = {
        location: formData.userSignLocation,
        signerName: formData.userSignName,
        signatureReason: formData.userSignReason,
        signatureImage: {
          base64: true,
          data: this.signImageb64 ? this.signImageb64 : '',
          evidenceType: formData.userSignEvType
        },
        signerCertificate: {
          base64: true,
          data: this.cerb64 ? this.cerb64 : '',
          evidenceType: formData.userSignEvType
        },
        boxBorder: true
      }

      if (formData.userSignBiData) {
        dataSign.idKey = 1,
        dataSign.biometricData = {};
      }



      //Second step sign pdf with digital sign
      await this.authSDService.apiSeguriDataMultilateralGetHash(JSON.stringify(dataSign)).subscribe(async res => {
        this.cookieService.delete('getHash')
        this.cookieService.set('getHash',JSON.stringify(res.hash));

              //get PKCS7 for multilateral/update/
       this.signaturePdf = await this.getSerie.getSignature(formData);
         //Map formData for signWithHash
      let DataSignWHash : {
        certificate: string,
        hash: {
          algorithm: string,
          value: string
        },
        password: string,
        privateKey: string,

      }

      this.getSerie.readBase64(this.certificateFile ? this.certificateFile : new File([], 'default.pdf')).then(async resCer => {
        this.getSerie.readBase64(this.privateKeyFile ? this.privateKeyFile : new File([], 'default.pdf')).then(async resKey => {
          //Set formData to signWithHash
          DataSignWHash = {
              certificate: resCer.split(',')[1],
              hash: {
                algorithm: JSON.parse(this.cookieService.get('startMultilateral')).hashAlg,
                value:  JSON.parse(this.cookieService.get('getHash')),
              },
              password: formData.userPkp,
              privateKey: resKey.split(',')[1]
            }

            //Map for update sign in pdf
            let DataUpdateSign : {
              serial: string,
              signedMessage: {
                base64: boolean,
                data: string,
                name: string
              }
            }

                  //Set update sign data
                  DataUpdateSign = {
                    serial: this.certificateSerie.serialNumber,
                    signedMessage: {
                      base64: true,
                      data: this.signaturePdf,
                      name: this.cerName
                    }
                  }

            //Probably only for BiometricData
                  //Third step Update firm set cer serie number and PKCS7 in signedmessage
            await this.authSDService.apiSeguriDataMultilateralUpdate(JSON.stringify(DataUpdateSign)).subscribe(async res => {
              if(res){
                this.closeFlag = true;
                await this.authSDService.finalizeSign(this.closeFlag.toString()).subscribe(res => {
                  this.getSerie.getFile(res.find((r : any)=> r.evidenceType === 'PDF').data,this.pdfName)
                })

              }
            })



        })
      })
      })



    })


  }


}

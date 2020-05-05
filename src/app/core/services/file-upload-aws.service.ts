import { Injectable } from '@angular/core';
// // aws file upload
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class FileUploadAWSService {
  public FOLDER = 'Images/';
  public BucketName = 'ecubearkidz';
  // public BucketName = 'ecubeshamaji';

  constructor() { }

  // upload on amazon s3  shamaji
  uploadfile(file) {
    const bucket = new S3({ accessKeyId: '', secretAccessKey: '', region: '' });
    const params = {
      Bucket: 'jsa-angular4-bucket',
      Key: this.FOLDER + file.name,
      Body: file
    };
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  uploadFileS3(file) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: 'AKIARWMRVL3JLVEOB35Z',
        secretAccessKey: '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',
        region: 'us-east-2'
      }
    );
    const params = {
      Bucket: 'ecuberepo',
      Key: this.FOLDER + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
    //for upload progress   
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }

  // dhruval
  // uploadFileAWS(assetObj) {
  //   const timeStamp = new Date().getTime();
  //   const key = this.FOLDER + timeStamp + '_' + assetObj.name;
  //   const contentType = assetObj.type;
  //   const bucket = new S3(
  //     {
  //       accessKeyId: 'AKIARWMRVL3JNYLX7IXS',
  //       secretAccessKey: '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',
  //       region: 'us-east-2',
  //       endpoint: 'rds.us-east-2.amazonaws.com'
  //     }
  //   );
  //   console.log('bucket : ', bucket);
  //   AWS.config.httpOptions.timeout = 0;
  //   let uploadID: string;
  //   const params = {
  //     Bucket: this.BucketName,
  //     Key: key,
  //     // Body: assetObj,
  //     ACL: 'public-read',
  //     ContentType: contentType
  //   };
  //   console.log('bucket params : ', params);
  //   bucket.createMultipartUpload(params, (err, data) => {
  //     if (err) {
  //       console.log(err, err.stack);  // an error occurred
  //     } else {
  //       uploadID = data.UploadId;
  //       const paramsForUploadPart = {
  //         Bucket: this.BucketName,
  //         Key: key,
  //         Body: assetObj,
  //         // ACL: 'public-read',
  //         PartNumber: 1,
  //         // ContentType: contentType,
  //         UploadId: uploadID
  //       };

  //       const req = bucket.uploadPart(paramsForUploadPart).on('httpUploadProgress', (evt) => {
  //         console.log(evt);
  //         console.log('File uploaded in progress');
  //       }).send((err1, data1) => {
  //         if (err1) {
  //           if (err1.name !== 'NoSuchUpload') {
  //             // assetObj.status = 'Failed';
  //             console.log('There was an error uploading your file: ', err1.message);
  //           }
  //           return false;
  //         }
  //         const paramsForCompleteMultipartUpload = {
  //           Bucket: this.BucketName,
  //           Key: key,
  //           UploadId: uploadID,
  //           MultipartUpload: {
  //             Parts: [
  //               {
  //                 ETag: data1.ETag,
  //                 PartNumber: 1
  //               },
  //             ]
  //           },
  //         };
  //         bucket.completeMultipartUpload(paramsForCompleteMultipartUpload, (err2, data2) => {
  //           if (err2) {
  //             console.log(err2, err2.stack); // an error occurred
  //           } else {
  //             console.log(data2);           // successful response
  //             // assetObj.status = 'Success';
  //             console.log('Successfully uploaded file.', data2);
  //           }
  //         });
  //         return true;
  //       });
  //     }
  //   });
  // }

}

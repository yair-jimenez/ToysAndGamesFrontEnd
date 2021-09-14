import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Generic, Result } from './product';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class GenericService {
  constructor(private http:HttpClient) {

  }
  create<T>(type: (new () => T)): T {
    return new type();
  }
  async getService<T extends Generic>(response:Result<T>){
   
    return response.getList(this.http);
  }
  async getPostDataService<T extends Generic>(response:Result<T>){
     return response.post(this.http);
  }
  async getPostFormDataService<T extends Generic>(response:Result<T>){
    return response.postFormData(this.http);
 }
  async getDeleteDataService<T extends Generic>(response:Result<T>){
    return response.delete(this.http).toPromise();
  }
  base64ToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }
}

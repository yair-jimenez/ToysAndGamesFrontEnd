import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Providers,Host } from "./urlProviders";

export interface Generic{
   id:number;
   
}
export class Result<T extends Generic>{
    public message:string = "";
    public error:string="";
    private _publicError:string="";
    public status:number=0;
    public responseList:T[] =[];
    public transactionaValue:T;
    public formData:FormData | undefined;
    public get publicError() {
       let res = "";
       if(this.status === 500){
           res = "Server Error";
       }
       return res;
    }
    constructor(private value:T){
       this.transactionaValue = value;
    }
    getList(httpClient:HttpClient):Observable<T[]>{
       return httpClient.get<T[]>(`${Host + this.getProviderList(this.value)}`);
    }
    post(httpClient:HttpClient):Observable<T[]>{
        return httpClient.post<T[]>(`${Host + this.getProviderList(this.value)}`,this.transactionaValue);
    }
    postFormData(httpClient:HttpClient):Observable<T[]>{
        return httpClient.post<T[]>(`${Host + this.getProviderList(this.value)}`,this.formData);
    }      
    delete(httClient:HttpClient):Observable<T[]>{
        return httClient.delete<T[]>(`${Host + this.getProviderList(this.value) + "/" + this.transactionaValue.id}`);
    }
    private getProviderList(type:T){
        const value = type.constructor.name;
        let provider = this.providerListByType(value.toString());
        return provider;

    }
    private providerListByType(value:string):string{
        let val:string ="";
        if(value.toLocaleLowerCase() === "product"){
            val = Providers.Products;
        }
        return val;
    }
}
export class Product implements Generic{
    id=0;
    ageRestriction:number=0;
    name:string="";
    description:string="";
    price:number=0;
    company:Company =  {
        id:0,
        name:"",
        addres:""
    };
    urlImage: string ="";
    image:any = null;
    constructor(){}
}
export class Company implements Generic{
    id=0
    name:string="";
    addres:string="";


}

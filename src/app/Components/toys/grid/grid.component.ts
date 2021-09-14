import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Product, Result } from 'src/app/Services/product';
import { GenericService } from 'src/app/Services/service.service';
import { Providers,Host } from "src/app/Services/urlProviders";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  products:Result<Product>;
  @Output() ontransactionalObjectToEdit = new  EventEmitter<Product>();
  @Output() ontransactionalObjectToDelete = new EventEmitter<number>();
  constructor(private service:GenericService) { 
       this.products = new Result<Product>(this.service.create(Product));
  }
  getHost(){
    return Host;
  }
  ngOnInit(): void {
    this.getProducts();
  }
  RemoveProduct(id:number):Promise<Result<Product>>{
    this.products.transactionaValue.id = id;
    let responseObject = new Result<Product>(this.service.create(Product));
    const response = this.service.getDeleteDataService(this.products).then(r=>{
      responseObject.status = 200;
      this.getProducts();
      return responseObject;
    },error=>{
      responseObject.error = error.message;
      return responseObject;
    });
    return response;
    
  }
  Delete(id:number){
    debugger;
    this.ontransactionalObjectToDelete.emit(id);
  }
 Edit(productToEdit:Product){
  
    this.ontransactionalObjectToEdit.emit(productToEdit);
 }
 async getProducts(){
   const res = (await this.service.getService(this.products)).subscribe(r => {

     this.products.responseList = r;
     this.products.status = 200;
     return this.products;
    
   },error=>{
    this.products.status = 500;
    this.products.error = error.message;
    return this.products;
   });

   
  }

}

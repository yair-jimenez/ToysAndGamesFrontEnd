import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, Result } from 'src/app/Services/product';
import { GridComponent } from './grid/grid.component';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.css'],

})
export class ToysComponent implements OnInit {
  @ViewChild("grid") grid:any;
  @ViewChild("form") form:any;
  
  constructor() { }

  ngOnInit(): void {
  }
  public async deleteRow(event:any){
    if(confirm('Do you want to remove it?')){
     
      await this.grid.RemoveProduct(event).then((response:Result<Product>)=>{
         alert(response.status === 200 ? 'item removed succesfully':'there is an issue when its tried remove the item');
      },(error:any)=>{
        alert(error.publicError);
      });
    }
  }
  public updateRow(event:any){
      debugger;
      this.form.openToEdit(event);
  }
  public updateResults(event:any){
   
    if(event.status === 200){
      this.grid.getProducts();
    }
}

}

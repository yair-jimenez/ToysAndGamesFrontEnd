import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, Validators,FormBuilder } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Company, Product, Result } from 'src/app/Services/product';
import { GenericService } from 'src/app/Services/service.service';
import { Output, EventEmitter } from '@angular/core';
import { Providers,Host } from "src/app/Services/urlProviders";
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @ViewChild("content") modalContent:any;
  imageTemporalSrc:string="";
  resultProduct!: Result<Product>;
  transactionalObjectToEdit:Product | undefined;
  closeResult = '';
  form!: FormGroup;
  stateText:string="";
  transactionalObject!: Product;
  @Output() hasChangeItsValue = new EventEmitter<Result<Product>>();
  modal!: NgbModalRef;
  constructor(private service:GenericService,private modalService: NgbModal,private formBuilder:FormBuilder) {
    
    
  }
  GetImage(){
    const defaultImage = '/assets/defaultImage.png';
   return this.imageTemporalSrc.length > 0 ?  this.imageTemporalSrc : typeof this.transactionalObjectToEdit !== 'undefined' ? 
      this.transactionalObjectToEdit.urlImage?.length > 0 ? 
       Host + this.transactionalObjectToEdit.urlImage 
      :  defaultImage
        :  defaultImage;
  }
  onFileChange(event:any){
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageTemporalSrc = reader.result as string;
     
        this.form.patchValue({
          fileSource: reader.result
        });
   
      };
   
    }
  }
  
  fillForm(){
    this.form.get('name')?.setValue(this.transactionalObjectToEdit?.name);
    this.form.get('price')?.setValue(this.transactionalObjectToEdit?.price);
    this.form.get('company')?.setValue(this.transactionalObjectToEdit?.company.name);
    this.form.get('age')?.setValue(this.transactionalObjectToEdit?.ageRestriction);
  }
  close(){
    this.adviseChange(this.resultProduct);
    this.CleanStates();
    this.form.reset();
    this.modal.close();
  }
  openToEdit(transactionalObjectToEdit:Product){
    this.transactionalObjectToEdit = transactionalObjectToEdit;
    this.open(this.modalContent);
  }
  CleanStates(){
    this.transactionalObjectToEdit = undefined;
    this.stateText="";
    this.imageTemporalSrc ="";
    
  }
  private setHeaderText(){
   this.stateText = this.transactionalObjectToEdit ? `${this.transactionalObjectToEdit.name} Edition`:'New Article';
  }
  open(content:any) {
    this.initComponent();
    this.setHeaderText();
    if(this.transactionalObjectToEdit){
      this.fillForm();
    }
  this.modal =  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',backdrop:'static'});
  this.modal.result.then((result) => {
   
   
    //this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    this.CleanStates();
    this.form.reset();
  });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  private initComponent(){
    this.resultProduct = new Result<Product>(this.service.create(Product));
    this.transactionalObject ={
      id: 0,
      ageRestriction: 0,
      name: '',
      description: '',
      price: 0,
      company: new Company,
      urlImage: '',
      image:null
    };
    this.form = this.buildForm();
  }
  ngOnInit(): void {
    this.initComponent();
  }
  private buildForm(){
    return this.formBuilder.group({
      name: ['',[Validators.required]],
      age: [this.transactionalObject.ageRestriction,[Validators.required,Validators.maxLength(3)]],
      price: [this.transactionalObject.price,[Validators.required,Validators.maxLength(5)]],
      company: ['',[Validators.required,Validators.maxLength(15)]],
      file:[''],
      fileSource: [''],
    });
    
    // this.form.valueChanges.pipe(
    //   debounceTime(500)
    // ).subscribe(v=>{
    //   console.log(v);
    // });
  }
  // closeModal(){
  //   this.modal.close('Save click');
  // }
  mapFormValuesToTransactionalObject(jsonObj:any){
    this.transactionalObject.name = jsonObj.name;
    this.transactionalObject.ageRestriction = jsonObj.age;
    this.transactionalObject.price = jsonObj.price;
    this.transactionalObject.company.name = jsonObj.company;
    //this.transactionalObject.image = jsonObj.fileSource;
  }
  private getNameImage(){
    if(this.imageTemporalSrc.length>0){
      const splittedPath = this.imageTemporalSrc.split("/");
      const name=splittedPath[splittedPath.length-1];
      return name;
    }
    return "";
  }
  appendToFormData(formValue:any){
    debugger;
      const formData = new  FormData();
      formData.append("id",JSON.stringify(this.transactionalObject.id));
      formData.append("name",JSON.stringify(this.transactionalObject.name));
      formData.append("ageRestriction",JSON.stringify(this.transactionalObject.ageRestriction));
      formData.append("price",JSON.stringify(this.transactionalObject.price));
      formData.append("company.id",JSON.stringify(this.transactionalObject.company.id));
      formData.append("company.name",JSON.stringify(this.transactionalObject.company.name));
      formData.append("company.addres",JSON.stringify(this.transactionalObject.company.addres));
      

      if(formValue.fileSource){
        const file = this.service.base64ToBlob(formValue.fileSource);
        formData.append('image',file,this.getNameImage());
      }
    return formData;
  }
  async save(event:Event){
    
    
    if(!this.form.errors){
        const valueForm = this.form.value;
        this.mapFormValuesToTransactionalObject(valueForm);
        debugger;
        if(this.transactionalObjectToEdit){
          this.transactionalObject.id = this.transactionalObjectToEdit.id;
        }
        this.resultProduct.formData = this.appendToFormData(valueForm);

        //this.resultProduct.transactionaValue = this.transactionalObject;
        const res = await (await this.service.getPostFormDataService(this.resultProduct)).subscribe(r=>{
        this.resultProduct.status = 200;
        this.close();
      },error => {
        this.resultProduct.status = 500;
        this.resultProduct.error = error.message;
        event.preventDefault();
      });
      
    }
    
  }
  adviseChange(result:Result<Product>){
    this.hasChangeItsValue.emit(result);
  }
}

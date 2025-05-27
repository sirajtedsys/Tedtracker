import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.page.html',
  styleUrls: ['./common-modal.page.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule]
})
export class CommonModalPage implements OnInit {

  SelectedList:any[]=[]

  @Input() DropDownData:any[]=[]
  @Input() Headers:any[]=[]
  @Input() Fields:any[]=[]
  @Input() ModalHeader:string='Header'
  @Input() CheckType:  'radio' | 'check' = 'radio'
  @Input() UniqueField = ''
  @Input() SelectedItems:any[]=[]
  searchQuery: string='';
  filteredData: any[]=[];

  constructor(private modalController:ModalController) { }

  ngOnInit() {
    console.log(this.DropDownData,this.SelectedItems);
    this.filteredData = this.DropDownData
    this.SelectedList=this.SelectedItems
    
  }


  DismissModal(){
    this.modalController.dismiss(null,'cancel')

  }

  Save() {
    this.modalController.dismiss({
      selected: this.SelectedList // Pass any data you want here
    }, 'confirm'); // Specify the role as 'confirm'
  }


  SelectAll(event:any)
  {
    let val  = event.target.checked
    if(val==true)
    {
      this.SelectedList=this.filteredData
    }
    else
    {
      this.SelectedList=[]
    }
    
  }

  SingleSelection(event:any,item:any)
  {
    let val  = event.target.checked

    if(this.CheckType=='check')
    {
      if(val == true)
        {
          this.SelectedList.push(item)
        }
        else
        {
          this.SelectedList = this.SelectedList.filter((x:any)=>x != item)
        }

    }
    else
    {
      if(val == true)
      {
        this.SelectedList=[]
        this.SelectedList.push(item)
        this.Save()
        // this.SelectedLis
      }
      else
      {
        this.SelectedList=[]
      }
    }

    // console.log(this.SelectedList);
    

    // [this.UniqueField]!=item[this.UniqueField]
  }


  filterDropdown(): void {
    const query = this.searchQuery.toString().toLowerCase();
    console.log(this.DropDownData);

    
    this.filteredData  = this.DropDownData.filter((item) =>
      this.Fields.some((header) =>
        item[header]?.toString().toLowerCase().includes(query)
      )
    );
    // this.filteredData=[]
    // // this.filteredData = this.DropDownData.filter((x:any))
    // for(let i = 0 ;i<this.SelectedList.length;i++)
    // {
    //   this.filteredData.push(this.SelectedList[i])
    // }

    // for(let j  =0;j<data.length;j++)
    // {
    //   this.filteredData.push(data[j])
    // }
  }

  

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  public id:number = -1;
  public text:string = '';
  public showInput:boolean = false;
  public isTextSearched:boolean = false;
  constructor(private router:Router, private activateRoute: ActivatedRoute) {
  }

  public getBtnId(event: any): void{
    this.id=parseInt(event.target.id);
    this.showInput = (this.id!= 1)?false:true;
  }

  public toggleInput(e:any){
    this.getBtnId(e);
    this.showInput = true;
    this.isTextSearched = false;
  }
  public searchText(){
    this.isTextSearched = true;
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as data from '../data.json';
@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  public readonly candidates = (data as any).default;
  public records: Array<any> = [];
  public id: number = -1;
  public headers: Array<string> = [];
  public userName: string = '';
  public departmentCntMap: Object = {};
  constructor(private route: ActivatedRoute) {
  }


  private sortByName() {
    let tempArr = this.candidates;
    return tempArr.sort((a: any, b: any) => (a.name < b.name));
  }

  private inMMDDYYYY(str: string) {
    let tempArr = str.split('/');
    let [a, b] = tempArr;
    [a, b] = [b, a];
    tempArr[0] = a;
    tempArr[1] = b;
    return tempArr.join('/');
  }

  private getExp(date: string): number {
    let exp: number = 0;
    let today = new Date().toLocaleDateString().split('/').map((ele) => parseInt(ele));
    let dateArr = date.split('/').map((ele) => parseInt(ele));
    if (today[2] >= dateArr[2]) {
      exp = today[2] - dateArr[2] + (today[1] - dateArr[1]) / 12;
    }
    return exp;
  }

  private isHaving2YExp() {
    let tempArr = this.candidates;
    this.records = tempArr.filter((candidate: any) => {
      if (this.getExp(candidate.joining_date) > 2) {
        return candidate;
      }
    })
  }
  private sortByDate() {
    let tempArr = this.candidates;
    return tempArr.sort((a: any, b: any) => {
      let d1 = new Date(this.inMMDDYYYY(a.joining_date)).getTime();
      let d2 = new Date(this.inMMDDYYYY(b.joining_date)).getTime();
      return d1 - d2;
    })
  }

  private filterOutDevDepartment(): void {
    let tempArr = this.candidates;
    this.records = tempArr.filter((candidate: any) => {
      if (candidate.department != 'Development') {
        return candidate;
      }
    });
  }

  private searchByName(): Array<any> {
    let result = [];
    if (this.userName) {
      let tempArr = this.candidates;
      result = tempArr.filter((candidate: any) => {
        if (this.userName.toLowerCase() == candidate.name.toLowerCase()) {
          return candidate;
        }
      })
    }
    return result;
  }

  private getDepartments(): Object{
    let departments: Array<any> = [];
    let mapping = {};
    this.candidates.forEach((candidate:any)=>{
      departments.push(candidate.department);
    });
    mapping = departments.reduce(function(prev, cur) {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});
    return mapping;
  }

  public displayResult() {
    let tempArr = [];
    switch (this.id) {
      case 0:
        tempArr = this.sortByName();
        this.records = this.sortByDate();
        break;
      case 1:
        this.records = this.searchByName();
        break;
      case 2:
        this.isHaving2YExp();
        break;
      case 3:
        this.departmentCntMap = this.getDepartments();
        break;
      case 4:
        this.filterOutDevDepartment();
        break;
      default:
        this.records = this.candidates;
        break;
    }
    if (this.records.length > 0) {
      if(this.id!=3){
        this.headers = Object.keys(this.records[0]);
      } else{
        this.headers = ['Department', 'Count'];
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.id = parseInt(params['id']);
        if (this.id == 1) {
          this.userName = params['userName'];
        }
        this.displayResult();
      }
    )
  }

}

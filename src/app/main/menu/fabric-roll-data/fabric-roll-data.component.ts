import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/api.service';
import * as XLSX from 'xlsx'


@Component({
  selector: 'app-fabric-roll-data',
  templateUrl: './fabric-roll-data.component.html',
  styleUrls: ['./fabric-roll-data.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FabricRollDataComponent implements OnInit {
  dataSource: any[] = []
  data: any[] = [];
  fabricdetails: any
  ordernumber: any;
  buyers: any;
  buyerName: any;
  order: any;
  ordernumbers: any;
  stylelist: any;
  styleslist: any;
  colorlist: any;
  colorslist: any;
  sizelist: any;
  sizeslist: any;
  workorderhide: boolean = true;
  workorderId: any;
  WoNumber: any;
  fabdetails: any;
  rollnnumber: any;
  wodetails: any;
  fabid: any;
  AllWoDetails: any[] = [];
  entry1: any[] = [];
  entry2: any[] = [];
  entry3: any[] = [];
  entry4: any[] = [];
  entry5: any[] = [];
  entry6: any[] = [];
  entry7: any[] = [];
  entry1total: any;
  entry2total: any;
  entry3total: any;
  entry4total: any;
  entry5total: any;
  entry6total: any;
  entry7total: any;
  LoadingTotal:boolean=false;


  constructor(private api: ApiService,
    private http: HttpClient,
    private cdref: ChangeDetectorRef,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getbuyers();
  }

  fileName = "Fabricrolldata.xlsx"
  fileName2="Workorder-data.xlsx"
  exportexcel2() {
    /* Passing table id */
    let data = document.getElementById("table-data2");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
  
    /* Generate workbook and append the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    /* Save to file */
    XLSX.writeFile(wb, this.fileName2);
  }
  exportexcel() {
    /* Passing table id */
    let data = document.getElementById("table-data");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    /* Generate workbook and append the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  check(id: any) {
    const entry = 1
    this.api.getfabricdetails(id, entry).subscribe((res) => {
      this.dataSource = res.fabricRolls
    })
  }
  public getbuyers() {
    this.api.getbuyers().subscribe((res) => {
      this.buyers = res.buyers;
    })
  }

  loaddetails() {
    this.spinner.show();
    this.LoadingTotal=true
    this.data.forEach((woId: any) => {
      const entry = 1
      this.api.getfabricdetails(woId.id, entry).subscribe((res) => {
        this.dataSource = res.fabricRolls
        this.entry1 = [];
        this.entry2 = [];
        this.entry3 = [];
        this.entry4 = [];
        this.entry5 = [];
        this.entry6 = [];
        this.entry7 = [];
        this.dataSource.forEach((entry) => {
          if (entry.entry_1 != 0) {
            this.entry1.push(entry.entry_1);
          }
          if (entry.entry_2 != 0) {
            this.entry2.push(entry.entry_2);
          }
          if (entry.entry_3 != 0) {
            this.entry3.push(entry.entry_3);
          }
          if (entry.entry_4 != 0) {
            this.entry4.push(entry.entry_4);
          }
          if (entry.entry_4 != 0 && entry.reason == 'yes') {
            this.entry5.push(entry.entry_4);
          }
          if (entry.entry_6 != 0) {
            this.entry6.push(entry.entry_6);
          }
          if (entry.entry_7 != 0) {
            this.entry7.push(entry.entry_7);
          }
        })
        this.entry1total = this.entry1.reduce((acc, num) => acc + num, 0)
        this.entry2total = this.entry2.reduce((acc, num) => acc + num, 0)
        this.entry3total = this.entry3.reduce((acc, num) => acc + num, 0)
        this.entry4total = this.entry4.reduce((acc, num) => acc + num, 0)
        this.entry5total = this.entry5.reduce((acc, num) => acc + num, 0)
        this.entry6total = this.entry6.reduce((acc, num) => acc + num, 0)
        this.entry7total = this.entry7.reduce((acc, num) => acc + num, 0)
        woId['rollTotal'] = this.entry1total
        woId['firstRolls'] = this.entry1.length

        woId['greigeTotal'] = this.entry2total
        woId['secondRolls']=this.entry2.length
        
        woId['dyeTotal'] = this.entry3total
        woId['thirdRolls']=this.entry3.length
        
        woId['finishTotal'] = this.entry4total
        woId['fourthRolls']=this.entry4.length

        woId['delTotal'] = this.entry5total
        woId['fifthRolls']=this.entry5.length

        woId['planTotal'] = this.entry6total
        woId['sixthRolls']=this.entry6.length

        woId['actualCutTotal'] = this.entry7total
        woId['seventhRolls']=this.entry7.length

      })
    })
  }

  getorders(buyer: any) {
    this.api.getorders(buyer).subscribe((res) => {
      this.order = res.orders
    })
    const proftoken = 'Bearer ' + sessionStorage.getItem('token')
    const headers = new HttpHeaders().set('x-access-token', proftoken);
    this.http.get<any>(`${this.api.apiUrl}/workorderapi/workorders-filter?buyer=${buyer}`, { headers }).subscribe((res) => {
      this.data = res.workorders
      this.loaddetails();
      setTimeout(()=>{
        this.spinner.hide()
      },3000)
    })
  }

  getstyle(buyer: any, orderNo: any) {
    this.api.getstyle(buyer, orderNo).subscribe((res) => {
      this.stylelist = res.styles;
    })
    const proftoken = 'Bearer ' + sessionStorage.getItem('token')
    const headers = new HttpHeaders().set('x-access-token', proftoken);
    this.http.get<any>(`${this.api.apiUrl}/workorderapi/workorders-filter?buyer=${buyer}&orderNo=${orderNo}`, { headers }).subscribe((res) => {
      this.data = res.workorders
      this.loaddetails();
      setTimeout(()=>{
        this.spinner.hide()
      },15000)
    })
  }

  getcolor(buyer: any, orderNo: any, style: any) {
    this.api.getcolor(buyer, orderNo, style).subscribe((res) => {
      this.colorlist = res.colors;
    })
    const proftoken = 'Bearer ' + sessionStorage.getItem('token')
    const headers = new HttpHeaders().set('x-access-token', proftoken);
    this.http.get<any>(`${this.api.apiUrl}/workorderapi/workorders-filter?buyer=${buyer}&&orderNo=${orderNo}&&style=${style}`, { headers }).subscribe((res) => {
      this.data = res.workorders
      this.loaddetails();
      setTimeout(()=>{
        this.spinner.hide()
      },10000)
    })
  }

  getsize(buyer: any, orderNo: any, style: any, color: any) {
    this.api.getsize(buyer, orderNo, style, color).subscribe((res) => {
      this.sizelist = res.sizes;
    })
  }



  onSelectionChange() {
    if (this.buyerName) {
      this.getorders(this.buyerName);
    }
    if (this.buyerName && this.ordernumbers) {
      this.getstyle(this.buyerName, this.ordernumbers)
    }
    if (this.buyerName && this.ordernumbers && this.styleslist) {
      this.getcolor(this.buyerName, this.ordernumbers, this.styleslist)
    }
    if (this.buyerName && this.ordernumbers && this.styleslist && this.colorslist) {
      this.getsize(this.buyerName, this.ordernumbers, this.styleslist, this.colorslist)
      this.api.getwodetails(this.buyerName, this.ordernumbers, this.styleslist, this.colorslist)
    }
    if (this.buyerName && this.ordernumbers && this.styleslist && this.colorslist && this.sizeslist) {
      this.loadworkorder(this.buyerName, this.ordernumbers, this.styleslist, this.colorslist, this.sizeslist)
    }
  }


  loadworkorder(buyer: any, orderNo: any, style: any, color: any, size: any) {
    const proftoken = 'Bearer ' + sessionStorage.getItem('token')
    const headers = new HttpHeaders().set('x-access-token', proftoken);
    this.http.get<any>(`${this.api.apiUrl}/workorderapi/workorders-filter?buyer=${buyer}&orderNo=${orderNo}&style=${style}&color=${color}&size=${size}`, { headers }).subscribe((res) => {
      this.data = res.workorders
      this.loaddetails();
      setTimeout(()=>{
        this.spinner.hide()
      },5000)
    })
  }
}




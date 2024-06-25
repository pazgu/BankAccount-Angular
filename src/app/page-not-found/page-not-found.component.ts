import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  ngOnInit(): void {
  // I didn't redirect the page to the AccountLogin because I wanted to show the error messege - נכנסת למקום לא חוקי.
  }
}


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
    theNum = 0;
    minVal = 0;
    maxVal = 100;

    getRndNum(lower: number, upper: number) {
        return Math.floor(Math.random() * (upper + 1 - lower)) + lower;
    }
    moveNum(moveUp: boolean) {
        if (moveUp && this.theNum < this.maxVal) {this.theNum++}
        if (!moveUp && this.theNum > this.minVal) {this.theNum--}
    }
    reroll() {
        this.theNum = this.getRndNum(this.minVal, this.maxVal);
    }
    ngOnInit() {
        this.reroll();
    }
}

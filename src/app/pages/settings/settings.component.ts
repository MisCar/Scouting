import { Component, OnInit } from "@angular/core"

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  showCoords(event: any) {
    let imgae = document.getElementById("img")
    var x = event.clientX
    var y = event.clientY
    var coords = "X coords: " + x + ", Y coords: " + y
    let position = imgae?.getBoundingClientRect()
    //let screenHight = $(window).height()
    //let screenWidth = $(window).width()
    console.log(coords + " imgae pos " + position?.top)
    let win = window,
      doc = document,
      docElem = doc.documentElement,
      xScreen = win.innerWidth || docElem.clientWidth,
      yScrern = win.innerHeight || docElem.clientHeight
    alert(xScreen + " × " + yScrern)
  }
}

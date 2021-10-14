import { Component, Inject, OnInit } from "@angular/core"
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { DialogData } from "../form.component"

@Component({
  selector: "app-warning",
  templateUrl: "./warning.component.html",
  styleUrls: ["./warning.component.scss"],
})
export class WarningComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<WarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  skip() {
    this.data.warn = ""
    this.dialogRef.close()
  }

  updateWarn(event: Event) {
    this.data.warn = (event.target as HTMLInputElement).value
  }
  ngOnInit(): void {}
}

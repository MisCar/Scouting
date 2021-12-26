import { Component, OnInit } from "@angular/core"
import { doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore"
import Schema, { Section } from "app/models/schema.model"

@Component({
  selector: "app-schema-editor",
  templateUrl: "./schema-editor.component.html",
  styleUrls: ["./schema-editor.component.scss"],
})
export class SchemaEditorComponent implements OnInit {
  sections: Section[] = []
  schema: Schema = { sections: [] }

  showSchemaEdit: boolean = false
  showMangeScouts: boolean = false

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.getCurrentData()
  }

  async getCurrentData() {
    let schema = await getDoc(doc(this.firestore, "admin/schema"))
    let data = schema.data()
    for (let section of data?.sections) {
      this.sections.push(section)
    }
  }

  addSection() {
    this.sections.push({ title: "", prefix: "", widgets: [] })
  }

  addWidget(section: Section) {
    section.widgets.push({ key: "", label: "", type: "Counter" })
  }

  removeWidget(widgetIndex: number, sectionIndex: number) {
    this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
  }

  removeSection(sectionIndex: number) {
    this.sections.splice(sectionIndex, 1)
  }

  eventToString(event: Event): string {
    return (event.target as HTMLInputElement).value
  }

  eventToNumber(event: Event): number {
    return Number((event.target as HTMLInputElement).value)
  }

  async update() {
    this.schema = { sections: this.sections } as Schema
    await setDoc(doc(this.firestore, "admin/schema"), this.schema)
  }

  moveWidgetUp(widgetIndex: number, sectionIndex: number) {
    if (widgetIndex == 0) return

    const widget = this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
    this.sections[sectionIndex].widgets.splice(widgetIndex - 1, 0, widget[0])
  }

  moveWidgetDown(widgetIndex: number, sectionIndex: number) {
    if (this.sections[sectionIndex].widgets.length == widgetIndex + 1) return
    const widget = this.sections[sectionIndex].widgets.splice(widgetIndex, 1)
    this.sections[sectionIndex].widgets.splice(widgetIndex + 1, 0, widget[0])
  }

  moveSectionUp(sectionIndex: number) {
    if (sectionIndex == 0) return
    const section = this.sections.splice(sectionIndex, 1)
    this.sections.splice(sectionIndex - 1, 0, section[0])
  }

  moveSectionDown(sectionIndex: number) {
    if (sectionIndex == this.sections.length) return
    const section = this.sections.splice(sectionIndex, 1)
    this.sections.splice(sectionIndex + 1, 0, section[0])
  }
}

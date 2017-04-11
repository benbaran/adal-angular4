import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ADAL4Service } from "./adal4.service";

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [ADAL4Service],
})
export class ADAL4Module { }

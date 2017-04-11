import { NgModule } from "@angular/core";

import { ADAL4Module } from "./adal4.module";
import { ADAL4Service } from "./adal4.service";

@NgModule({
  imports: [
    ADAL4Module,
  ],
  providers: [ADAL4HTTPModule],
})
export class ADAL4HTTPModule { }

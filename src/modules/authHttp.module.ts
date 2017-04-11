import { NgModule } from '@angular/core';

import { AdalModule } from './adal.module';
import { AuthHttp } from './../services/authHttp.service'

@NgModule({
    imports: [AdalModule],
    exports: [],
    declarations: [],
    providers: [AuthHttp],
})
export class AuthHttpModule { }

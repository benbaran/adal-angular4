"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var adal4_service_1 = require("./adal4.service");
describe('Adal4Service', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [adal4_service_1.Adal4Service]
        });
    });
    it('should ...', testing_1.inject([adal4_service_1.Adal4Service], function (service) {
        expect(service).toBeTruthy();
    }));
});

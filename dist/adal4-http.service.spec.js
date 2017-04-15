"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var adal4_http_service_1 = require("./adal4-http.service");
describe('Adal4HTTPService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [adal4_http_service_1.Adal4HTTPService]
        });
    });
    it('should ...', testing_1.inject([adal4_http_service_1.Adal4HTTPService], function (service) {
        expect(service).toBeTruthy();
    }));
});

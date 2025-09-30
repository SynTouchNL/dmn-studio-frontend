import { TestBed } from '@angular/core/testing';
import { DMNService } from './dmn-service';

describe('DmnService', () => {
    let service: DMNService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DMNService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { bearerDto } from '../data/data';
import { Guid } from 'typescript-guid';

describe('DataService', () => {
  let dataService: DataService;
  let httpMock: HttpTestingController;
  let partyGuid: Guid | undefined;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        DataService
      ],
    });
    dataService = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(dataService).toBeTruthy();
  });

  it('should return admin token', () => {
    // should be coded
  });

  it('should return regular token', () => {
    const simulatedToken: bearerDto = {
      partyGuid: partyGuid?.toString(),
      partyAddress: 'test@test.com',
      bearerToken: generateMockJwt('', '')
    };

  });

});

function generateMockJwt(role: string, partyGuid: string): string {
  return '';
}


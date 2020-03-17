import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { TemplateService } from './template.service';
import { Server } from '../models/server';
import { HttpServer } from './http-server.service';
import { AppTestingModule } from '../testing/app-testing/app-testing.module';

describe('TemplateService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppTestingModule],
      providers: [TemplateService, HttpServer]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(TemplateService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should ask for the list from server', () => {
    const server = new Server();
    server.host = '13.235.99.198';
    server.port = 3080;
    server.authorization = 'none';

    service.list(server).subscribe(() => {});

    const req = httpTestingController.expectOne('http://ec2-13-235-99-198.ap-south-1.compute.amazonaws.com:443/v2/templates');
    expect(req.request.url).toBe('http://ec2-13-235-99-198.ap-south-1.compute.amazonaws.com:443/v2/templates');
  });
});

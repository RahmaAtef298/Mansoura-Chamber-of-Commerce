import { Component } from '@angular/core';
import { AuthService } from './Administration/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngApp';

  constructor( private authService: AuthService ) { }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
  
}

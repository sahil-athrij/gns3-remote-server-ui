import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Node} from '../../../../../cartography/models/node';
import {Server} from '../../../../../models/server';

@Component({
  selector: 'app-show-config-action',
  templateUrl: './show-config-action.component.html'
})
export class ShowConfigActionComponent {
  @Input() node: Node;
  @Input() server: Server;
  projectName: string;

  constructor(private dialog: MatDialog) {
    const url = document.referrer;
    this.projectName = `${url.substr(0, url.lastIndexOf("/") + 1)}${document.title}.html`;
  }
}

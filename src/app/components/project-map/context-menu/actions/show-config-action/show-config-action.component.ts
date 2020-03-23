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
    this.projectName = `${document.title}.html`;
  }
}

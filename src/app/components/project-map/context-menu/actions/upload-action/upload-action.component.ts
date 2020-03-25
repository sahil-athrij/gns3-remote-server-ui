import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Node } from '../../../../../cartography/models/node';
import { Server } from '../../../../../models/server';
import { UploadComponent } from '../../../node-editors/uploader/upload.component';


@Component({
  selector: 'app-upload-node-action',
  templateUrl: './upload-action.component.html'
})
export class UploadActionComponent {
  @Input() server: Server;
  @Input() node: Node;
  private conf = {
    autoFocus: false,
    width: '800px',
    disableClose: true
  };
  dialogRef;

  constructor(private dialog: MatDialog) {}

  uploadFile() {
    this.dialogRef = this.dialog.open(UploadComponent, this.conf);

    const instance = this.dialogRef.componentInstance;
    instance.server = this.server;
    instance.node = this.node;
  }
}

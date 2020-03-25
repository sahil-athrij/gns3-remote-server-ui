import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Node} from '../../../../cartography/models/node';
import {Server} from '../../../../models/server';
import {NodeService} from '../../../../services/node.service';
import {ToasterService} from '../../../../services/toaster.service';


@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
    server: Server;
    node: Node;
    name: string;
    inputForm: FormGroup;
    consoleTypes: string[] = [];
    file: any;

    constructor(
        public dialogRef: MatDialogRef<UploadComponent>,
        public nodeService: NodeService,
        private toasterService: ToasterService,
        private formBuilder: FormBuilder,
    ) {
        this.inputForm = this.formBuilder.group({
            name: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        this.nodeService.getNode(this.server, this.node).subscribe((node: Node) => {
            this.node = node;
            this.name = node.name;
        });
    }


    onSaveClick(event) {
        this.file = event.target.files[0];

        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            console.log(fileReader.result);
            const matcher = /xConfiguration SIP Mode: "On"/;
            const text = fileReader.result;
            if (typeof text === "string") {
                const result = matcher.test(text);
                if (result) {
                    this.toasterService.success(`Loading`);

                    this.nodeService.startAll(this.server, this.node).subscribe(() => {
                        this.toasterService.success(`All Configuration Correct`);
                        this.onCancelClick();
                    });

                } else {
                     this.nodeService.stopAll(this.server, this.node).subscribe(() => {
                        this.toasterService.error(`Configurations are Wrong`);
                        this.onCancelClick();
                    });
                }
            }

        };
        fileReader.readAsText(this.file);
        // if (this.inputForm.valid) {
        //     this.nodeService.updateNode(this.server, this.node).subscribe(() => {
        //         this.toasterService.success(`Node ${this.node.name} updated.`);
        //         this.onCancelClick();
        //     });
        // } else {
        //     this.toasterService.error(`Fill all required fields.`);
        // }
    }

    onCancelClick() {
        this.dialogRef.close();
    }
}

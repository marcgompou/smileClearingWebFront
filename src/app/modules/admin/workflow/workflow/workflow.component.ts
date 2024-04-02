import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
  animations: fuseAnimations
})
export class WorkflowComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}



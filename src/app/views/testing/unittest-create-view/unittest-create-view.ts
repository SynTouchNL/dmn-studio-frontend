import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http-service/http-service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Variable } from '../../../interfaces/decisions-interface';

@Component({
    selector: 'app-unittest-create-view',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './unittest-create-view.html',
    styleUrl: './unittest-create-view.css'
})

export class UnittestCreateView implements OnInit {
    dmnData: any = {};
    selected_key: any = null;
    selected_value: any = null;
    expected_result: any = '';
    myForm: any;

    constructor(
        private router: Router,
        private http: HttpService,
        private formBuilder: FormBuilder,
        private cd: ChangeDetectorRef
    )
    {
        const navState = this.router.currentNavigation()?.extras?.state as any | undefined;
        this.dmnData = navState.data || [];
    }

    ngOnInit(){
        this.myForm = this.formBuilder.group({
            input_key: new FormControl(null),
            input_value: new FormControl(null),
            output_key: new FormControl(null),
            output_value: new FormControl(null),
        });

        this.myForm.get("input_key").valueChanges.subscribe(
            (value: Variable) => {
                if (value !== null) {
                    this.selected_key = value;
                    this.cd.detectChanges();
                }
            }
        );
    }

}

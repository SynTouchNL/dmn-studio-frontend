import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-key-pair-form',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './key-pair-form.html',
  styleUrl: './key-pair-form.css'
})

export class KeyPairForm implements OnInit {
    @Input() title = '';
    @Input() hitPolicy = '';
    @Input() variables: any[] = []; // incoming or outgoing
    @Input() formArray!: FormArray;
    @Input() maxRows?: number;
    @Input() isInput = false;


    constructor(private fb: FormBuilder) {}

    get rows(): FormGroup[] {
        return this.formArray.controls as FormGroup[];
    }

    ngOnInit(): void {
        if (this.formArray.length === 0) {
            this.addPair();
        }
    }

    createPair(): FormGroup {
        const group = this.fb.group({
            key: [null, Validators.required],
            typeRef: [null],
            value: [null, Validators.required],
        });

        group.get('key')?.valueChanges.subscribe(keyName => {
            const selected = this.variables.find(v => v.name === keyName);
            group.patchValue({ typeRef: selected?.typeRef ?? null, value: null });
        });

        return group;
    }

    addPair() {
        if(this.isInput){
            if (!this.maxRows || this.formArray.length < this.maxRows) {
                this.formArray.push(this.createPair());
            }
        } else {
            this.formArray.push(this.createPair());
        }
    }

    removePair(index: number) {
        this.formArray.removeAt(index);
    }

    getSelectedKey(index: number) {
        const keyName = this.formArray.at(index).get('key')?.value;
        return this.variables.find(v => v.name === keyName);
    }

    // hitPolicyOutputCanBeMultiple(hitPolicy: String): boolean {
    //     if ()
    //
    //
    // }

}

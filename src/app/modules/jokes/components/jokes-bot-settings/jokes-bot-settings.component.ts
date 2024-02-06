import { ChangeDetectionStrategy, Component, WritableSignal, input, signal } from '@angular/core';
import { toSignal } from "@angular/core/rxjs-interop";
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SpeechService } from 'app/core/speech/speech.service';

@Component({
    selector: 'app-jokes-bot-settings',
    templateUrl: 'jokes-bot-settings.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class JokesBotSettingsComponent {

    voices = input.required<SpeechSynthesisVoice[]>();

    configsForm = this._formBuilder.group({
        voice: ['', Validators.required]
    });

    showModal: WritableSignal<boolean> = signal(false);

    /**
     * Constructor
     */
    constructor(
        private readonly _speechService: SpeechService,
        private readonly _formBuilder: FormBuilder
    ) { }
}

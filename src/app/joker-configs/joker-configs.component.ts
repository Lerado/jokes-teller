import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Voice } from '../models/voice.model';
import { SpeechService } from '../services/speech.service';

@Component({
  selector: 'app-joker-configs',
  templateUrl: 'joker-configs.component.html',
  styleUrls: ['./joker-configs.component.css'],
})
export class JokerConfigComponent implements OnInit {
  configsForm: FormGroup = new FormGroup({
    voice: new FormControl('', [Validators.required]),
  });

  showModal: boolean = false;

  voices?: Voice[];

  selectedVoiceName?: string;

  onShowConfigsForm() {
    this.showModal = true;
  }

  onCloseConfigsForm() {
    this.showModal = false;
  }

  onVoiceSelection() {
    this.selectedVoiceName = this.configsForm.get('voice')?.value;
    // console.log(this.selectedVoiceName)
  }

  constructor(private speechService: SpeechService) {
    this.speechService.getVoices().subscribe((voices) => {
      this.voices = voices;
    });
  }

  ngOnInit() {}
}

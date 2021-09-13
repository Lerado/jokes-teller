import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { JokeTellerComponent } from './joker-teller/joke-teller.component';
import { JokeService } from './services/joke.service';
import { SpeechService } from './services/speech.service';
import { JokerConfigComponent } from './joker-configs/joker-configs.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, JokeTellerComponent, JokerConfigComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
  providers: [JokeService, SpeechService],
  bootstrap: [AppComponent],
})
export class AppModule {}

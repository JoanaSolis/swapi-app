import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { home, search, addCircle, chatbubbles } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  constructor(private router: Router) {
    // Registrar iconos
    addIcons({ home, search, addCircle, chatbubbles });
  }

  ngOnInit() {
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
}

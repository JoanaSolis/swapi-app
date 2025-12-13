import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    // Inicializar usuarios de prueba
    await this.authService.initializeTestUsers();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      // El servicio ya navega automáticamente
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async loginWithGoogle() {
    alert('Función de Google Sign-In pendiente de implementación');
  }
}

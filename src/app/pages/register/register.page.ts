import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  nombre: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onRegister() {
    if (!this.nombre || !this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading = true;
    try {
      await this.authService.register(this.nombre, this.email, this.password);
      // El servicio ya hace auto-login y navega
    } catch (error: any) {
      alert(error.message || 'Error al registrarse');
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

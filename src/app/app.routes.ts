import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'publicaciones',
    loadComponent: () => import('./pages/publicaciones/publicaciones.page').then(m => m.PublicacionesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'buscador',
    loadComponent: () => import('./pages/buscador/buscador.page').then(m => m.BuscadorPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'publicar',
    loadComponent: () => import('./pages/publicar/publicar.page').then(m => m.PublicarPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat-conversation/:id',
    loadComponent: () => import('./pages/chat-conversation/chat-conversation.page').then(m => m.ChatConversationPage),
    canActivate: [AuthGuard]
  }
];
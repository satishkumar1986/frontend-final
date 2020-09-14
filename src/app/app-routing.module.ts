import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'home/shop', pathMatch: 'full' },
  { path: 'landingpage', component: LandingpageComponent },
  {
    path: '', component: MainComponent, children: [
      { path: 'pages', loadChildren: () => import('../app/pages/pages.module').then(m => m.PagesModule) },
      { path: 'home', loadChildren: () => import('../app/shop/shop.module').then(m => m.ShopModule) }
    ]
  },
  { path: '**', redirectTo: 'pages/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

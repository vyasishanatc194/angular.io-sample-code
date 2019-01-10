/**
 * Created by PhpStorm.
 * User: TJ 
 * Date: 20/08/18
 * Time: 10:50 AM
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule ,CanActivate  } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ChildGardService } from './service/child-gard.service';
import { ParentGardService } from './service/parent-gard.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'parent',
        loadChildren: 'app/parent/parent.module#ParentModule',
        canActivate: [ParentGardService]
      },
      {
        path: 'child',
        loadChildren: 'app/child/child.module#ChildModule',
        canActivate: [ChildGardService]
      },
      {
        path: '',
        loadChildren: 'app/default/default.module#DefaultModule'
      }
   ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

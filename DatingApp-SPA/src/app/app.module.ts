import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from 'ngx-gallery';
import { JwtModule } from '@auth0/angular-jwt';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { NavComponent } from './_components/nav/nav.component';
import { HomeComponent } from './_components/home/home.component';
import { RegisterComponent } from './_components/register/register.component';
import { ListsComponent } from './_components/lists/lists.component';
import { MemberListComponent } from './_components/members/member-list/member-list.component';
import { MessagesComponent } from './_components/messages/messages.component';
import { MemberCardComponent } from './_components/members/member-card/member-card.component';
import { MemberDetailComponent } from './_components/members/member-detail/member-detail.component';
import { MemberEditComponent } from './_components/members/member-edit/member-edit.component';
import { PhotoEditorComponent } from './_components/members/photo-editor/photo-editor.component';
import { MemberMessagesComponent } from './_components/members/member-messages/member-messages.component';
import { AdminPanelComponent } from './_components/admin/admin-panel/admin-panel.component';
import { UserManagementComponent } from './_components/admin/user-management/user-management.component';
import { PhotoManagementComponent } from './_components/admin/photo-management/photo-management.component';
import { RolesModalComponent } from './_components/admin/roles-modal/roles-modal.component';

import { ErrorInterceptorProvider } from './_services/error/error.interceptor';

import { AuthService } from './_services/auth/auth.service';
import { AlertifyService } from './_services/alertify/alertify.service';
import { UserService } from './_services/user/user.service';
import { AdminService } from './_services/admin/admin.service';

import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';

import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

import { appRoutes } from './routes';

import { HasRoleDirective } from './_directives/hasRole.directive';



export function tokenGetter() {
   return localStorage.getItem('token');
}

export class CustomHammerConfig extends HammerGestureConfig {
   overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      ListsComponent,
      MemberListComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      MemberMessagesComponent,
      AdminPanelComponent,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModalComponent,
      TimeAgoPipe,
      HasRoleDirective
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      ModalModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,
      FileUploadModule,
      JwtModule.forRoot({
         config: {
            tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      ErrorInterceptorProvider,
      AuthService,
      AlertifyService,
      UserService,
      AdminService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      ListsResolver,
      MessagesResolver,
      AuthGuard,
      PreventUnsavedChanges,
      {
         provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig
      }
   ],
   entryComponents: [
      RolesModalComponent,
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

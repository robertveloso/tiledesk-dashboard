import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { IMyDpOptions, IMyDateModel } from 'mydatepicker';
import { NotifyService } from '../../core/notify.service';
import { ProjectPlanService } from '../../services/project-plan.service';
@Component({
  selector: 'appdashboard-activities-static',
  templateUrl: './activities-static.component.html',
  styleUrls: ['./activities-static.component.scss']
})
export class ActivitiesStaticComponent implements OnInit {
  activities: any;
  agentAvailabilityOrRoleChange: string;
  agentDeletion: string;
  agentInvitation: string;
  newRequest: string;
  projectId: string;
  prjct_profile_type: string;
  subscription_is_active: any;
  prjct_profile_name: string;
  subscription_end_date: Date;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    // dateFormat: 'yyyy, mm , dd',
  };

  constructor(
    private translate: TranslateService,
    public auth: AuthService,
    private router: Router,
    private prjctPlanService: ProjectPlanService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.buildActivitiesOptions();
    this.getCurrentProject();
    this.getProjectPlan();
  }


  getProjectPlan() {
    this.prjctPlanService.projectPlan$.subscribe((projectProfileData: any) => {
      console.log('ProjectPlanService (HomeComponent) project Profile Data', projectProfileData)
      if (projectProfileData) {



        this.prjct_profile_type = projectProfileData.profile_type;
        this.subscription_is_active = projectProfileData.subscription_is_active;
        this.prjct_profile_name = projectProfileData.profile_name;
        this.subscription_end_date = projectProfileData.subscription_end_date

        if (this.prjct_profile_type === 'payment' && this.subscription_is_active === false) {


          this.notify.displaySubscripionHasExpiredModal(true, this.subscription_is_active,  this.subscription_end_date)
        }


      }
    })
  }


  getCurrentProject() {
    this.auth.project_bs.subscribe((project) => {
      console.log('!!! ANALYTICS STATIC - project ', project)

      if (project) {
        this.projectId = project._id
      }
    });
  }

  // buildActivitiesOptions() {
  //   const browserLang = this.translate.getBrowserLang();
  //   if (browserLang) {
  //     if (browserLang === 'it') {
  //       this.activities = [
  //         { name: 'Modifica disponibilità o ruolo agente' },
  //         { name: 'Cancellazione agente' },
  //         { name: 'Invito agente' },
  //       ];
  //     } else {
  //       this.activities = [
  //         { name: 'Change agent availability or role' },
  //         { name: 'Agent deletion' },
  //         { name: 'Agent invitation' },
  //       ];
  //     }
  //   }
  // }

  buildActivitiesOptions() {
    this.translate.get('ActivitiesOptions')
      .subscribe((text: any) => {

        this.agentAvailabilityOrRoleChange = text.AgentAvailabilityOrRoleChange;
        this.agentDeletion = text.AgentDeletion;
        this.agentInvitation = text.AgentInvitation;
        this.newRequest = text.NewRequest;

        console.log('translateActivities AgentAvailabilityOrRoleChange ', text.AgentAvailabilityOrRoleChange)
        console.log('translateActivities AgentDeletion ', text.AgentDeletion)
        console.log('translateActivities AgentDeletion ', text.AgentInvitation)
        console.log('translateActivities newRequest ', text.newRequest)
      }, (error) => {
        console.log('ActivitiesComponent - GET translations error', error);
      }, () => {
        console.log('ActivitiesComponent - GET translations * COMPLETE *');

        this.activities = [
          { id: 'PROJECT_USER_UPDATE', name: this.agentAvailabilityOrRoleChange },
          { id: 'PROJECT_USER_DELETE', name: this.agentDeletion },
          { id: 'PROJECT_USER_INVITE', name: this.agentInvitation },
          { id: 'REQUEST_CREATE', name: this.newRequest },
        ];
      });
  }


  goToPricing() {
    this.router.navigate(['project/' + this.projectId + '/pricing']);
  }

}

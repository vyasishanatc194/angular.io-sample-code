/**
 * Created by PhpStorm.
 * User: TJ 
 * Date: 20/08/18
 * Time: 03:00 PM
 */


import { Component, OnInit ,ViewChild , ElementRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";


import { AuthApiService } from './../../default/auth-api.service';
import { CommonEventsService } from "../../common-events.service";
import { managestripeaccount } from "./../../app-data";
import { CardLoaderComponentComponent } from '../card-loader-component/card-loader-component.component';

@Component({
  selector: 'app-cards-component',
  templateUrl: './cards-component.component.html',
  styleUrls: ['./cards-component.component.css']
})


export class CardsComponentComponent implements OnInit {

  @ViewChild('fileInput') fileInput:ElementRef;

  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public pagedata: any = managestripeaccount;
  submitted = false;
  formload = false;
  formload_add = false;
  update_process: number = 0;
  reomve_process: number = 0;
  public childcardlist: any[] = [];
  public userdetail: any = {};
  public profile: any = {};

  elements: Elements;
  card: StripeElement;
  

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  constructor(private route: ActivatedRoute, private router: Router, public api: AuthApiService, private subscription: CommonEventsService, private stripeService: StripeService) {
    let authuser: any = JSON.parse(localStorage.getItem("authuser"));
    this.profile = authuser;
  }

  ngOnInit() {
    this.getCardList("");
    this.initCardObject("");
  }
  initCardObject(myData: any) {
    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.card) {
          this.card = this.elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontSmoothing: 'antialiased',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                  color: 'purple'
                }
              }
            }
          });
          this.card.mount('#card-element');
        }
      });
  }

  getCardList(myData: any) {

    this.formload = true;
    this.api.getAuthData("parent/get-my-cards", myData).subscribe(result => {
      this.formload = false;
      this.childcardlist = result.result;
    },
      (error) => { this.formload = false; })
  }

  openDetail(myData: any) {
    this.userdetail = myData;
  }

  setDefault(card_id, child_id) {
    this.update_process = card_id;
    let formData = { card_id: card_id, child_id: child_id };
    this.api.submitAuth("parent/set-default-card", formData).subscribe(result => {
      this.update_process = 0;

      for (let i = 0; i < this.childcardlist.length; i++) {
        if (this.childcardlist[i].stripe_id == result.result.stripe_id) {

          this.childcardlist[i] = result.result;
        }
      }

      let sucsess_ob = { action: 'flash_success', redirect_to: '', dataobj: { 'message': result.message, 'message_head': 'Success !' } };
      this.subscription.globleEvent(sucsess_ob);
    },
      (error) => { this.update_process = 0; this.displayError(error); })
  }

  deleteCard(card_id, child_id) {

    if (window.confirm('Are you sure to remove/delete card ? ')) {

      this.reomve_process = card_id;
      let formData = { card_id: card_id, child_id: child_id };
      this.api.submitAuth("parent/delete-card", formData).subscribe(result => {
        this.reomve_process = 0;

        for (let i = 0; i < this.childcardlist.length; i++) {
          if (this.childcardlist[i].stripe_id == result.result.stripe_id) {
            this.childcardlist[i] = result.result;
          }
        }

        let sucsess_ob = { action: 'flash_success', redirect_to: '', dataobj: { 'message': result.message, 'message_head': 'Success !' } };
        this.subscription.globleEvent(sucsess_ob);
      },
        (error) => { this.reomve_process = 0; this.displayError(error); })

    }
  }


  addcard() {
    
   
    this.formload_add = true;
    const name = this.userdetail.username;
    this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          let formData = { token_id: result.token.id, child_id: this.userdetail.id };
          this.onSubmit(formData);

        } else if (result.error) {
          this.formload_add = false;
          let error_ob = { action: 'flash_error', redirect_to: '', dataobj: { 'message': result.error.message, 'message_head': 'Request Not Procceed !' } };
          this.subscription.globleEvent(error_ob);

        }
      });
  }

  onSubmit(formData: any) {
      
    this.api.submitAuth("parent/add-card", formData).subscribe(result => {

      for (let i = 0; i < this.childcardlist.length; i++) {
        if (this.childcardlist[i].stripe_id == result.result.stripe_id) {
          this.childcardlist[i] = result.result;
        }
      }

      this.formload_add = false;
      this.fileInput.nativeElement.click();
      let sucsess_ob = { action: 'flash_success', redirect_to: 'parent/child/subscription/'+result.result.id, dataobj: { 'message': result.message, 'message_head': 'Success !' } };
      this.subscription.globleEvent(sucsess_ob);

    },
      (error) => { this.formload_add = false; this.displayError(error); })

  }


  displayError(error: any) {
    this.enableForm();
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    if (error.error && error.error.message) {
      errMsg = error.error.message
    }
    let error_ob = { action: 'flash_error', redirect_to: '', dataobj: { 'message': errMsg, 'message_head': 'Request Not Procceed !' } };
    this.subscription.globleEvent(error_ob);
  }
  enableForm() {
    let that = this;
    setTimeout(function () {
      that.formload = false;
    }, 2000);
  }

}


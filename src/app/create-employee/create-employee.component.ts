import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';
import { NgForm } from '@angular/forms';

@Component({ templateUrl: 'create-employee.component.html' })
export class CreateEmployee implements OnInit {
    currentUser: User;
    users: User[] = [];
    errorUserName: string;
    isSaved: boolean = false;
    //email:string="";
    phoneNumber: string = "";
    showPhoneErr: string = "";
    phoneNumberPattern = "/^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi";
    isValidFormSubmitted = false;
    isUserNameExistOrEmpty: boolean = false;
    userName: string = "";
    isAdult: boolean = true;
    isStartWithSpecChar: boolean = false;
    employeeData = [];
    @ViewChild("btnSubmit", { static: true })
    btnSubmit: ElementRef;
    userError:string="";


    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.isSaved = false;
    }

    // delete Admin user
    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    }

    // to see all users who can add employee details to local storage
    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    // validate phone number ,should not be alphbet
    keyPress(event: any, whichValidation: string) {
        let pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (whichValidation === "Phone") {
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
        else {
            pattern = /^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi
            if (event.keyCode !== 8 && !pattern.test(inputChar)) {
                this.isStartWithSpecChar = true;
            }
        }
    }

    // submit empolyee details
    saveEmployee(employee: NgForm) {
        this.isAdult = true;
        this.isStartWithSpecChar = false;
        this.isUserNameExistOrEmpty = false;
        this.setEmployeeToLocalStorage(employee.form.value);
        this.getEmployeeToLocalStorage();
        employee.resetForm();
    }
    // set employee details to loacl storage
    setEmployeeToLocalStorage(employeeDataLoc) {
        this.userName = employeeDataLoc["userName"];
        //this.employeeData.push(employeeData_loc)
        localStorage.setItem(this.userName, JSON.stringify(employeeDataLoc));
        this.isSaved = true;
    }

    // get employee details to loacl storage
    getEmployeeToLocalStorage() {
        let empData = JSON.parse(localStorage.getItem("employee"));
        return empData;
    }

    // if user name exit disable save button
    validateUserName() {
        if (localStorage[this.userName]) {
            this.isUserNameExistOrEmpty = true;
            this.userError="User already exist"
            this.btnSubmit.nativeElement.disabled = true;
        }
        else if (this.userName == "") {
            this.isUserNameExistOrEmpty = true;
            this.btnSubmit.nativeElement.disabled = true;
            this.userError="User is required."
        }
        else {
            this.isUserNameExistOrEmpty = false;
            this.btnSubmit.nativeElement.disabled = false;
        }
    }

    // validate age ,if less than 18 years show error msg
    validateAge(birthdate) {
        if (birthdate) {
            var ageDifMs = Date.now() - Date.parse(birthdate);
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            let age = Math.abs(ageDate.getUTCFullYear() - 1970);
            if (age >= 18) this.isAdult = true;
            else { this.isAdult = false };
            console.log(age)
        }

    }


}

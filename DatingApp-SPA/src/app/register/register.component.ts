import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  model: any = {};
  @Output() cancelRegister = new EventEmitter();
  constructor(private authservice: AuthService) {}

  ngOnInit() {}

  cancel() {
    this.cancelRegister.emit(false);
    console.log("Cancelled");
  }
  register() {
    this.authservice.register(this.model).subscribe(
      () => {
        console.log("Registration Successfull");
      },
      (error) => {
        console.log(error);
      }
    );
  }
}

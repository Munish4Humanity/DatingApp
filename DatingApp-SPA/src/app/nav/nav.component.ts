import { AlertifyService } from "../_services/alertify.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    public authservice: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {}
  login() {
    this.authservice.login(this.model).subscribe(
      (next) => {
        this.alertify.success("Logged Successfully");
      },
      (error) => {
        console.log("Failed to Login");
      }
    );
  }
  loggedIn() {
    return this.authservice.loggedin();
  }
  logout() {
    localStorage.removeItem("token");
    this.alertify.message("logged out");
  }
}

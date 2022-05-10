import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Post } from "./post.model";
import { PostService } from "./post.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  error = null;
  errorSubscription: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.errorSubscription = this.postService.error.subscribe((errorMsg) => {
      this.error = errorMsg;
    });

    this.isFetching = true;
    this.postService.fetchPosts().subscribe((response: Post[]) => {
      this.loadedPosts = response;
      this.isFetching = false;
    });
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createPost(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe((response: Post[]) => {
      this.loadedPosts = response;
      this.isFetching = false;
    }),
      (error) => {
        //This way we can deal with cases of unsuccessful request
        console.log(error.message);
      };
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts();
    this.loadedPosts = [];
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}

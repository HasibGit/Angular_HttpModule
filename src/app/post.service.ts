import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Post } from "./post.model";
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createPost(postData: { title: string; content: string }) {
    this.http
      .post<{ name: string }>(
        "https://ng-learn-ecf44-default-rtdb.firebaseio.com/posts.json", // first param is the url of api. the .json is just firebase specific requirement
        postData, // as second param, we can send the data we want to post
        {
          observe: "response", // As response, what we wanna get. By default its 'body'. 'response' gives the whole response.
        }
      )
      .subscribe((response) => {
        // all http req are observables, in order to send http req, we need to subscribe to it. Otherwise angular will think
        console.log(response); // we are not interested in the response of this req, and this req won't even get send
      }),
      (error) => {
        this.error.next(error.message);
      };
  }

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>( // for any http req, we can specify what will the response data be like this way
        "https://ng-learn-ecf44-default-rtdb.firebaseio.com/posts.json", // It is a recommended practice, as it improves autocomplete and avoid ts
        //errors

        // As a last parameter, we can send some extra information like headers

        {
          headers: new HttpHeaders({ "Random-Information": "1234" }),
          params: new HttpParams().set("print", "pretty"), // basically sending query params with url in a clean way. We can also send multiple query params
          responseType: "json", // json is by default. We can also get the response as 'text', 'blob' etc.
        }
      ) // as response, we get a json obj, which has all the posts nested into it
      .pipe(
        // we want to convert it into an array of posts. For this, we can use map from rxjs which
        // will map our response to a postsarray
        map((response) => {
          const postsArray = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              postsArray.push({ ...response[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // Usecase of some rxjs operators to catch errors
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete("https://ng-learn-ecf44-default-rtdb.firebaseio.com/posts.json", {
        observe: "events",
      })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.DownloadProgress) {
            console.log("Show some spinner");
          }
          if (event.type === HttpEventType.Sent) {
            console.log("Show success modal");
          }
          if (event.type === HttpEventType.UploadProgress) {
            console.log("Show progressbar");
          }

          // You got the idea..
        })
      );
  }
}

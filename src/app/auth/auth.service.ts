import {Injectable, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IUser} from "./IUser";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {BlogService} from "../main/sections/blogs/blog.service";
import {CommentsService} from "../main/sections/comments/comments.service";
import firebase from "firebase/compat";

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  constructor(private fireAuth : AngularFireAuth,
              private store : AngularFirestore,
              private storageService: AngularFireStorage,
              private blogService: BlogService,
              private commentService: CommentsService) {
    this.user = fireAuth.user;
  }

  user!: Observable<firebase.User | null>;
  private userUrl = 'users';

  login(email: string, password: string){
    return this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  getUserById(id: string){
    return this.store.collection<IUser>(this.userUrl).doc(id).get()
      .pipe(
        map(user => {
          return user.data() as IUser;
        })
      )
  }

  register(email: string, password: string, fullName: string, photoURL: string | null){
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then(value => {
        value.user?.updateProfile({
          displayName: fullName,
          photoURL: photoURL
        })
          .then(_ => {
            if (value.user){
              const user: IUser = {
                uid: value.user.uid,
                email: value.user.email,
                fullName: value.user.displayName,
                photoUrl: value.user.photoURL
              }

              this.store.collection<IUser>(this.userUrl).doc(user.uid).set(user)
                .catch(err => alert(err));
            }
          })
          .catch(err => alert(err));
      });
  }

  logout(){
    return this.fireAuth.signOut()
  }

  updatePhotoUrl(url: string) : Promise<void>{
    return new Promise((resolve, reject) => {
      this.user.subscribe(user => {
        if (user) {
          user.updateProfile({ photoURL: url })
            .then(() => {
              this.store.collection(this.userUrl)
                .doc(user.uid)
                .update({ photoUrl: url })
                .then(() => resolve())
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        } else {
          reject("User is not available");
        }
      });
    });
  }

  updateEmail(emailPrev: string, email: string, password: string){
    return new Promise<void>((resolve, reject) => {
      this.login(emailPrev, password)
        .then(credential => {
          if (!credential.user){
            reject('update Email, credential user');
          }
          else{
            credential.user.updateEmail(email)
              .then(_ => {
                this.store.collection<IUser>(this.userUrl)
                  .doc(credential.user?.uid)
                  .update({email: email})
                  .then(_ => resolve())
              })
          }
        })
        .catch(err => reject(err));
    })
  }

  updateFullName(fullName: string): Promise<string>{
    return new Promise((resolve, reject) => {
      this.user.subscribe(user => {
        if(user){
          user.updateProfile({displayName: fullName})
            .then(_ => {
              this.store.collection(this.userUrl)
                .doc(user.uid)
                .update({fullName: fullName})
                .then(_ => resolve(fullName))
                .catch(err => reject(err))
            })
            .catch(err => reject(err));
        }
        else{
          reject("User is not available");
        }
      });
    });
  }

  deleteUser(email: string, password: string){
    return new Promise<void>((resolve, reject) => {
      this.login(email, password)
        .then(credential => {
          if (credential.user){
            credential.user.delete()
              .then(_ => this.store.collection(this.userUrl).doc(credential.user!.uid).delete()
                .then(_ => this.blogService.deleteUserBlogs(credential.user!.uid)
                  .then(_ => this.commentService.deleteUserComments(credential.user!.uid)
                    .then(_ => {
                      if (credential.user?.photoURL != "https://selfmadewebdesigner.com/wp-content/uploads/2019/09/self-made-web-designer-upwork-profile.jpg"){
                        this.blogService.removeImg(credential.user?.photoURL!)
                          .then(_ => resolve())
                          .catch(err => reject(err));
                      }
                      else{
                        resolve();
                      }
                    })
                    .catch(err => reject(err)))
                  .catch(err => reject(err)))
                .catch(err => reject(err)))
              .catch(err => reject(err))
          }
          else{
            reject('no credential user on delete');
          }
        })
        .catch(err => reject(err));
    });
  }
}

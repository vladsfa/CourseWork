import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IComment} from "./IComment";
import {BehaviorSubject, filter, forkJoin, map, Subject} from "rxjs";
import {Timestamp} from "firebase/firestore";
import {IBlog} from "../blogs/models/IBlog";

@Injectable({
  providedIn: 'root'
})
export class CommentsService{

  constructor(private store: AngularFirestore) {
  }

  commentsPath = "comments";

  get(id: string){
    return this.store.collection(this.commentsPath).doc(id).get()
      .pipe(map(doc =>{
        if (doc.exists){
          return doc.data() as IComment;
        }
        else{
          throw new Error('Document not found');
        }
      }));
  }

  add(fields : Object){
    const comment: IComment = {
      id: this.store.createId(),
      date: Timestamp.fromDate(new Date()),
      ...fields} as unknown as IComment;
    console.log(comment);
    this.store.collection(this.commentsPath).doc(comment.id).set(comment)
      .catch(err => console.log(err));
  }

  getAll(){
    return this.store.collection<IComment>(this.commentsPath).valueChanges();
  }

  getByBlog(id: string){
    return this.getAll().pipe(
      map(comments =>
        comments.filter(comment => comment.bid === id))
    );
  }

  deleteBlogComments(bid: string){
    return this.deleteByCriterion('bid', bid);
  }

  deleteComment(cid: string){
    return new Promise<void>((resolve, reject) => {
      this.store.collection(this.commentsPath).doc(cid).delete()
        .then(_ => resolve())
        .catch(err => reject(err));
    })
  }

  updateComment(cid: string, text: string){
    return new Promise<void>((resolve, reject) => {
      this.store.collection<IComment>(this.commentsPath).doc(cid).update({text: text})
        .then(_ => resolve())
        .catch(err => reject(err));
    })
  }

  deleteUserComments(uid: string){
    return this.deleteByCriterion('uid', uid)
  }

  deleteByCriterion(criterion: string, data: string){
    return new Promise<void>((resolve, reject) => {
      this.store.collection<IComment>(this.commentsPath, ref => ref.where(criterion, '==', data))
        .valueChanges()
        .subscribe(documents => {
          if(documents.length == 0){
            resolve();
            return;
          }

          const deletePromises = documents.map(comment => this.deleteComment(comment.id));
          forkJoin(deletePromises)
            .subscribe(() => {
              resolve();
            }, error => {
              reject(error);
            });
        }, error => {
          reject(error);
        });
    });
  }
}

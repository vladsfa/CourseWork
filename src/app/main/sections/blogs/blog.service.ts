import {Injectable} from '@angular/core';
import {forkJoin, map, Observable} from "rxjs";
import {IBlog} from "./models/IBlog";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {doc} from "@angular/fire/firestore";
import {CommentsService} from "../comments/comments.service";
import {IComment} from "../comments/IComment";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  postsPath: string = "blogs";

  constructor(private store: AngularFirestore,
              private storage: AngularFireStorage,
              private commentsService: CommentsService) {
  }

  async add(blog: IBlog, img: File) {
    try {
      blog.imgUrl = await this.addImg(img, `${this.postsPath}/${blog.id}`);
      this.store.collection<IBlog>(this.postsPath).doc(blog.id).set(blog)
        .catch(err => console.log(err));

      return;
    } catch (err) {
      throw err;
    }
  }

  getId() {
    return this.store.createId();
  }

  delete(bid: string) {
    return new Promise<void>((resolve, reject) => {
      this.get(bid).subscribe(blog => {
        this.store.collection<IBlog>(this.postsPath).doc(bid).delete()
          .then(_ => {
            Promise.all([
              this.commentsService.deleteBlogComments(bid),
              this.removeImg(blog.imgUrl)
            ]).then(_ => {
              resolve();
            })
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      }, err => reject(err))
    });
  }

  getAll() {
    return this.store.collection<IBlog>(this.postsPath).valueChanges();
  }

  getByCategory(category: string) {
    return this.getAll().pipe(
      map(blogs => blogs.filter(
        blog => blog.category.toLowerCase() === category
      ))
    )
  }

  get(id: string): Observable<IBlog> {
    return this.store.collection<IBlog>(this.postsPath).doc(id).get().pipe(
      map(doc => {
        if (doc.exists) {
          return doc.data() as IBlog;
        } else {
          throw new Error('Document not found');
        }
      })
    );
  }

  addImg(file: File, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.storage.upload(path, file)
        .then(_ => {
          this.storage.ref(path).getDownloadURL()
            .subscribe(url => resolve(url));
        }).catch(err => reject(err));
    });
  }

  removeImg(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.refFromURL(url).delete().subscribe(_ => {
        resolve();
      },
        err => reject(err));
    });
  }

  deleteUserBlogs(uid: string){
    return new Promise<void>((resolve, reject) => {
      this.store.collection<IBlog>(this.postsPath, ref => ref.where('author', '==', uid))
        .valueChanges()
        .subscribe(documents => {
          if (documents.length == 0){
            resolve();
            return;
          }

          const deletePromises = documents.map(blog => this.delete(blog.id));
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

  getUserBlogs(uid: string){
    return this.getAll().pipe(
      map(blogs => blogs.filter(blog => blog.author == uid)));
  }
}

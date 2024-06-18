import { action, makeObservable, observable } from "mobx";


class BookStore{
    url="http://localhost:8787";//צריך לשנות ךפי הניתו של השרת
    bookList = [];
    isUpload = false;//בודק אם הצליח להעלות קובץ או לא

    constructor(){
       makeObservable(this,{
          bookList: observable,
          tempBookList: observable,
          getList: action,
          sendDataToServer: action,
          addBookData: action,
       })
       this.sendDataToServer();
    }

    async sendDataToServer(){
        this.bookList = await this.getList();
        for(const book of this.tempBookList){
            const {title, description, tag, shelf} = book;
            if(!(this.bookList.find((book) => book.title === title))){//בדיקה אם אין שני ספרים עם אותה כותרת
                await fetch(this.url + "/books",{
                    method: "POST",
                    headers:{"Content-Type": "application/json",},
                    body: JSON.stringify({title, description, tag, shelf})
                });
            }
        }
        this.tempBookList = await this.getList();
    }

    async addBookData(title, description, tag, shelf){
        const res = await fetch(this.url + "/books",{
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({title, description, tag, shelf})
        });
        if(res.status !== 200){
            throw new Error('Faild to add book')
        }
        this.tempBookList = await this.getList();
    }

    getList = async () =>{
        const books = await fetch(this.url + "/books");
        const data = await books.json();
        return data;
    }
}
export default new BookStore();
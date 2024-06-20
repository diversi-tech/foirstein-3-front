import { action, makeObservable, observable } from "mobx";


class BookStore {
  url = "http://localhost:8787";//צריך לשנות ךפי הניתו של השרת
  bookList = [];
  tempBookList = [];
  isUpload = false;//בודק אם הצליח להעלות קובץ או לא
  isClick = true;

  constructor() {
    makeObservable(this, {
      bookList: observable,
      tempBookList: observable,
      isClick: observable,
      getList: action,
      sendDataToServer: action,
      addBookData: action,
      deleteBookFromServer: action,
      updateBookInServer: action
    })
    // this.sendDataToServer();
  }

  async sendDataToServer() {
    this.bookList = await this.getList();
    for (const book of this.tempBookList) {
      const { title, description, tag, shelf } = book;
      if (!(this.bookList.find((book) => book.title === title))) {//בדיקה אם אין שני ספרים עם אותה כותרת
        await fetch(this.url + "/books", {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({ title, description, tag, shelf })
        });
      }
    }
    this.tempBookList = await this.getList();
  }

  async addBookData(title, description, tag, shelf) {
    const res = await fetch(this.url + "/books", {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ title, description, tag, shelf })
    });
    if (res.status === 200) {
      this.isUpload = true;
    }
    else {
      this.isUpload = false;
    }
    this.tempBookList = await this.getList();
  }

  async deleteBookFromServer(title) {
    fetch(`http://localhost:8787/books/${title}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        console.log('Book deleted successfully');
        // כאן תוכלי לעדכן את המצב של הרשימה או לבצע פעולה אחרת לאחר המחיקה
      })
      .catch(error => console.error('Error:', error));
  }

  async updateBookInServer(title, updatedBook) {
    fetch(`http://localhost:8787/books?title=${encodeURIComponent(title)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook)
    })
      .then(response => response.json())
      .then(() => {
        console.log('Book updated successfully');
        // עדכון המצב של הרשימה או פעולה אחרת
      })
      .catch(error => console.error('Error:', error));
  }


  getList = async () => {
    const books = await fetch(this.url + "/books");
    const data = await books.json();
    return data;
  }
 }
export default new BookStore();
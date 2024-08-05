import { makeObservable, runInAction, observable, action } from "mobx";
import Swal from "sweetalert2";
import itemStore from "./item-store";

const baseUrl = "https://libererisas-backend.onrender.com/api/Borrowing";

class BorrowingStore {
  borrowingList = [];
  studentList = [];
  bookList = [];
  physicalList = [];
  message = "";

  constructor() {
    makeObservable(this, {
      borrowingList: observable,
      studentList: observable,
      bookList: observable,
      physicalList: observable,
      fetchBorrowing: action,
      updateBorrowing: action,
      deleteBorrowing: action,
      addBorrowing: action,
    });
    this.fetchBorrowing();
  }

  async fetchBorrowing() {
    try {
      console.log("in fetch Borrowing");
      const res = await fetch(baseUrl);
      let data = await res.json();
      const resStudents = await fetch(
        "https://foirstein-1-back.onrender.com/api/Users/getUsers"
      );
      let dataStudents = await resStudents.json();
      this.bookList = itemStore.mediaList.filter(
        (item) => item.isApproved === true && item.itemType == 0
      );
      this.physicalList = itemStore.mediaList.filter(
        (item) => item.isApproved === true && item.itemType == 0
      );
      runInAction(() => {
        this.borrowingList = this.extractRawData(data);
        this.studentList = this.extractRawData(
          dataStudents.filter((student) => student.role === "Student")
        );
      });
    } catch (error) {
      // this.failure("!!!בעיה בהבאת הנתונים");
      console.error("Failed to fetch Borrowing:", error);
    }
  }

  extractRawData(proxyObject) {
    if (proxyObject != undefined && proxyObject.data != null) {
      console.log("Extracting data from proxy object:", proxyObject.data);
      return proxyObject.data;
    } else {
      console.log(
        "Returning original object as it's not a proxy:",
        proxyObject
      );
      return proxyObject;
    }
  }

  async addBorrowing(BorrowingData) {
    try {
      console.log("hello in add");
      console.log(BorrowingData.date);
      const res = await fetch(baseUrl + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BorrowingData),
      });
      if (res.status === 200) {
        this.success("!נוסף בהצלחה");
      } else {
        this.failure("!ההוספה נכשלה");
      }
      this.fetchBorrowing();
    } catch (error) {
      console.error("Failed to update Borrowing:", error);
    }
  }

  async updateBorrowing(BorrowingId, BorrowingData) {
    try {
      console.log("BorrowingData: " + JSON.stringify(BorrowingData));
      const res = await fetch(baseUrl + "/" + BorrowingId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(BorrowingData),
      });
      if (res.status === 200) {
        this.success("!עודכן בהצלחה");
      } else {
        this.failure("!העדכון נכשל");
      }
      this.fetchBorrowing();
    } catch (error) {
      console.error("Failed to update Borrowing:", error);
    }
  }

  async deleteBorrowing(BorrowingId) {
    try {
      console.log("in delete");
      const res = await fetch(baseUrl + "/" + BorrowingId, {
        method: "DELETE",
      });
      if (res.status === 200) {
        this.success("!נמחק בהצלחה");
      } else {
        this.failure("!המחיקה נכשלה");
      }
      this.fetchBorrowing();
    } catch (error) {
      console.error("Failed to delete Borrowing:", error);
    }
  }

  success(message) {
    Swal.fire({
      text: message,
      icon: "success",
      timer: 1700,
    });
  }
  failure(message) {
    Swal.fire({
      icon: "error",
      title: "...אופס",
      text: message,
      timer: 1700,
    });
  }
  get getBorrowingsList() {
    return this.borrowingList;
  }
}
const borrowingStore = new BorrowingStore();
export default borrowingStore;
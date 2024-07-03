import { makeObservable, runInAction, observable, action } from "mobx";
import Swal from "sweetalert2";

const baseUrl = "https://localhost:7297/api/Tag";

class TagStore {
  tagList = [];
  addOpen = false;
  isUpdate = false;
  isError = true;

  constructor() {
    makeObservable(this, {
      tagList: observable,
      fetchTag: action,
      updateTag: action,
      deleteTag: action,
      addTag: action,
    });
    this.fetchTag();
  }

  async fetchTag() {
    try {
      console.log("in fetch");
      const res = await fetch(baseUrl);
      let data = await res.json();
      runInAction(() => {
        this.tagList = this.extractRawData(data);
        console.log("Processed data:", this.tagList);
      });
    } catch (error) {
      this.failure("!!!בעיה בהבאת הנתונים");
      console.error("Failed to fetch tag:", error);
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

  async deleteTag(tagId) {
    try {
      console.log("in delete");
      const res = await fetch(baseUrl + "/" + tagId, {
        method: "DELETE",
      });
      if (res.status === 200) {
        this.isDelete = true;
        this.success("!נמחק בהצלחה");
        this.fetchTag();
      }
      this.fetchTag();
    } catch (error) {
      this.failure("!המחיקה נכשלה");
      console.error("Failed to delete tag:", error);
    }
  }

  async addTag(tagData) {
    try {
      console.log("tagData: " + JSON.stringify(tagData));
      const res = await fetch(baseUrl + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagData),
      });
      if (res.status === 200) {
        this.success("!התווסף בהצלחה");
        this.isUpdate = true;
      } else {
        this.isUpdate = false;
        this.failure("!ההוספה נכשלה");
      }
      this.fetchTag();
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  }

  async updateTag(tagId, tagData) {
    try {
      console.log("tagData: " + JSON.stringify(tagData));
      const res = await fetch(baseUrl + "/" + tagId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagData),
      });
      if (res.status === 200) {
        this.success("!עודכן בהצלחה");
        this.isUpdate = true;
      } else {
        this.failure("!העדכון נכשל");
        this.isUpdate = false;
      }
      this.fetchTag();
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  }

  success(message) {
    Swal.fire({
      text: message,
      icon: "success",
    });
  }
  failure(message) {
    Swal.fire({
      icon: "error",
      title: "...אופס",
      text: message,
    });
  }
}
const tagStore = new TagStore();
export default tagStore;

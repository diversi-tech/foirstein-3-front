import { makeAutoObservable, observable } from "mobx";

class ItemStore {
  mediaList = [
    {
      title: "bbbb",
      description: "aaaaaa",
      tag: "Tag1",
      shelf: "k1",
      type: "book",
    },
    {
      title: "fffff",
      description: "hhhhh",
      tag: "Tag2",
      shelf: "1",
      type: "file",
    },
  ];
  add = false;
  isUpdate = false;
  isError = true;
  message = "הקובץ  עודכן בהצלחה! ✅";

  constructor() {
    makeAutoObservable(this, {
      isDelete: observable,
      isAdd: observable,
      isUpdate: observable,
      isError: observable,
      add: observable,
    });
  }

  async fetchMedia() {
    try {
      const res = await fetch("/api/media");
      this.mediaList = await res.json();
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  }

  async uploadMedia(mediaType, mediaData) {
    try {
      const formData = new FormData();
      for (const key in mediaData) {
        formData.append(key, mediaData[key]);
      }
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        this.isError = true;
        this.message = " הועלה בהצלחה! ✅";
      } else {
        this.isError = false;
        this.message = "העלאה נכשלה";
      }

      this.fetchMedia();
    } catch (error) {
      console.error("Failed to upload media:", error);
      this.isError = true;
    }
  }

  async deleteMedia(mediaId) {
    try {
      const res = await fetch(`/api/media/${mediaId}`, {
        method: "DELETE",
      });
      if (res.status === 200) {
        this.isDelete = true;
      }
      this.fetchMedia();
    } catch (error) {
      console.error("Failed to delete media:", error);
    }
  }

  async updateMedia(mediaId, mediaData) {
    try {
      const formData = new FormData();
      for (const key in mediaData) {
        formData.append(key, mediaData[key]);
      }
      const res = await fetch(`/api/media/${mediaId}`, {
        method: "PUT",
        body: formData,
      });
      if (res.status === 200) {
        this.isUpdate = true;
        this.message = "  הקובץ  עודכן בהצלחה! ✅";
      } else {
        this.isUpdate = false;
        this.message = "!עדכון הקובץ לא הצליח";
      }
      this.fetchMedia();
    } catch (error) {
      console.error("Failed to update media:", error);
    }
  }
}

const itemStore = new ItemStore();
export default itemStore;

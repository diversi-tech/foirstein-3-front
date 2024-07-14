import { makeAutoObservable, observable, action, computed } from 'mobx';
import { toJS } from 'mobx';

const baseURL='https://libererisas-backend.onrender.com/api/Item';

class ItemStore {
    pendingItemsList = []
    mediaList = [];
    add = false;
    isUpdate;
    isDeleteItem;
    isDeleteTag;
    isError = true;
    message = "נכשל";
    isApprov = false;

    constructor() {
        makeAutoObservable(this, {
            isDeleteItem: observable,
            isDeleteTag: observable,
            mediaList: observable,
            isAdd: observable,
            isUpdate: observable,
            isDelete: observable,
            isError: observable,
            setAdd: action,
            add: observable,
            fetchMedia: action,
            updateMedia: action,
            isApprov: observable,
            // add: observable,
            pendingItemsList: observable,
            // getPendingList: computed,
            fetchPendingItems: action,
            approvalItem: action,
            deniedItem: action
        });
        this.fetchPendingItems();
        this.fetchMedia();
    }

    async deleteTag(itemId, tagId) {
        console.log("hiiDeleteTag");
        try {
            const res = await fetch(`${baseURL}/${itemId}/${tagId}`, {
                method: 'DELETE'
            });
            console.log("delete tag:");
            if (res.status === 200) {
                this.isDeleteTag = true;
                this.message = " נמחק בהצלחה! ✅"

            }
            else {
                this.isDeleteTag = false;
                this.message = "מחיקה נכשלה"
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    get getPendingList() {
        return this.pendingItemsList;
    }
    async fetchPendingItems() {

        try {
            const res = await fetch(`${baseURL}/Pending`);
            const obj = await res.json();
            let list = toJS(obj);
            this.pendingItemsList = list;
            console.log(list);
            console.log(toJS(obj));
        }
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }
    async approvalItem(itemId) {
        console.log(itemId)
        // this.isApprov = false;
        try {
            const res = await fetch(`${baseURL}/approvItem/${itemId}`, { method: 'PUT' });
            console.log("status:" + res.status);
            if (res.status === 200) {
                this.isApprov = true;
                this.message = " הפריט אושר";
                await itemStore.fetchPendingItems();
            }
            else {
                this.message = "אישור פריט לא הצליח"
            }
            this.fetchPendingItems();
        } catch (error) {
            console.error('Failed to approv the item:', error);
        }
    }
    async deniedItem(itemId) {
        console.log(itemId)
        this.isDeind = false;
        try {
            const res = await fetch(`${baseURL}/deny/${itemId}`, {
                method: 'PUT'
            });
            if (res.status === 200) {
                this.isDeind = true;
                this.message = " הפריט נדחה ✅";
            }
            else {
                this.isUpdate = false;
                this.message = "!אישור פריט לא הצליח"
            }
            this.fetchPendingItems();
        } catch (error) {
            console.error('Failed to approv the item:', error);
        }
    }

    async fetchMedia() {
        try {
            const res = await fetch(`${baseURL}`);
            const obj = await res.json();
            this.mediaList = obj.data;
            console.log("list media: ", this.mediaList);
        }
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }

    async uploadMediaFile(mediaData) {
        try {
            const res = await fetch(`${baseURL}/file`, {
                method: 'POST',
                body: mediaData,
            });
            if (res.status === 200) {
                this.isError = false;
                this.message = "הועלה בהצלחה! ✅"
            } else {
                this.isError = true;
                this.message = "העלאה נכשלה"
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }

    async uploadMediaBook(mediaData) {
        try {
            const res = await fetch(`${baseURL}/book`, {
                method: 'POST',
                body: mediaData,
            });
            if (res.status === 200) {
                this.isError = false;
                this.message = "הועלה בהצלחה! ✅"
            } else {
                this.isError = true;
                this.message = "העלאה נכשלה"
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }


    async deleteMedia(mediaId) {
        // console.log("hiiDeleteMedia!!!!!!!!");
        try {
            const res = await fetch(`${baseURL}/${mediaId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {

                this.isDeleteItem = true;
                this.message = " נמחק בהצלחה! ✅"

            }
            else {
                this.isDeleteItem = false;
                this.message = "מחיקה נכשלה"

            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    async updateMediaBook(mediaId, mediaData) {
        try {

            console.log("formData: ", mediaData, "beforeFetch");
            const res = await fetch(`${baseURL}/book/${mediaId}`, {
                method: 'PUT',
                body: mediaData
            });
            console.log("formData: ", mediaData, "afterFetch");
            this.fetchMedia();

            if (res.status === 200) {
                this.isUpdate = true;
                this.message = "  הספר  עודכן בהצלחה! ✅";
            }
            else {
                this.isUpdate = false;
                this.message = "!עדכון הספר לא הצליח"
            }
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }

    async updateMediaFile(mediaId, mediaData) {
        try {

            console.log("formData: ", mediaData, "beforeFetch");
            const res = await fetch(`${baseURL}/file/${mediaId}`, {
                method: 'PUT',
                body: mediaData
            });
            console.log("formData: ", mediaData, "afterFetch");
            this.fetchMedia();

            if (res.status === 200) {
                this.isUpdate = true;
                this.message = "  הקובץ  עודכן בהצלחה! ✅";
            }
            else {
                this.isUpdate = false;
                this.message = "!עדכון הקובץ לא הצליח"
            }
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }
}
const itemStore = new ItemStore();
export default itemStore;
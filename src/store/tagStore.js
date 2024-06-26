import { makeAutoObservable, observable } from 'mobx';

class TagStore {
    tagList = [
        {
            id: "101",
            name: "היסטוריה"
        },
        {
            id: "102",
            name: "מתח"
        }
    ];
    isUpdate = false;
    isError = true;
    message = "הקובץ  עודכן בהצלחה! ✅";

    constructor() {
        makeAutoObservable(this, {
            isDelete: observable,
            isAdd: observable,
            isUpdate: observable,
            isError: observable
        });
    }

    async fetchTag() {
        try {
            const res = await fetch('/api/tag');
            this.tagList = await res.json();
        } catch (error) {
            console.error('Failed to fetch tag:', error);
        }
    }

    async uploadTag(tagData) {
        try {
            const tagData = new tagData();
            for (const key in tagData) {
                formData.append(key, tagData[key]);
            }
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (res.status === 200) {
                this.isError = true;
                this.message = " הועלה בהצלחה! ✅"
            }
            else{
                this.isError = false;
                this.message = "העלאה נכשלה"
            }

            this.fetchTag();
        } catch (error) {
            console.error('Failed to upload tag:', error);
            this.isError = true;
        }
    }

    async deleteTag(tagId) {
        try {
            const res = await fetch(`/api/tag/${tagId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {
                this.isDelete = true;
            }
            this.fetchTag();
        } catch (error) {
            console.error('Failed to delete tag:', error);
        }
    }

    async updateTag(tagId, tagData) {
        try {
            const formData = new FormData();
            for (const key in tagData) {
                formData.append(key, tagData[key]);
            }
            const res = await fetch(`/api/tag/${tagId}`, {
                method: 'PUT',
                body: formData
            });
            if (res.status === 200) {
                this.isUpdate = true;
                this.message = "  הקובץ  עודכן בהצלחה! ✅";
            }
            else{
                this.isUpdate = false;
                this.message = "!עדכון הקובץ לא הצליח"
            }
            this.fetchTag();
        } catch (error) {
            console.error('Failed to update tag:', error);
        }
    }
}

const tagStore = new TagStore();
export default tagStore;


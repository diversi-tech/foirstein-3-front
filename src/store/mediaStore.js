import { action, makeObservable, observable } from "mobx";


class MediaStore {
    url = "http://localhost:8787";//צריך לשנות ךפי הניתו של השרת
    mediaList = [];
    tempMediaList = [];
    isUpload = false;//בודק אם הצליח להעלות קובץ או לא
    isClick = true;
    constructor() {
        makeObservable(this, {
            mediaList: observable,
            tempMediaList: observable,
            isClick: observable,
            getList: action,
            sendDataToServer: action,
            addMediaData: action,
            deleteMediaFromServer: action,
            updateMediaInServer: action
        })
        // this.sendDataToServer();
    }

    async sendDataToServer() {
        this.mediaList = await this.getList();
        for (const media of this.tempMediaList) {
            const { title, description, tag } = media;
            if (!(this.mediaList.find((media) => media.title === title))) {//בדיקה אם אין שני קבצים עם אותה כותרת
                await fetch(this.url + "/media", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({ title, description, tag })
                });
            }
        }
        this.tempMediaList = await this.getList();
    }

    async addMediaData(title, description, tag) {
        const res = await fetch(this.url + "/media", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ title, description, tag })
        });
        if (res.status === 200) {
            this.isUpload = true;
        }
        else {
            this.isUpload = false;
        }
        this.tempMediaList = await this.getList();
    }

    async deleteMediaFromServer(title) {
        fetch(`http://localhost:8787/media/${title}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                console.log('Media deleted successfully');
                // כאן תוכלי לעדכן את המצב של הרשימה או לבצע פעולה אחרת לאחר המחיקה
            })
            .catch(error => console.error('Error:', error));
    }

    async updateMediaInServer(title, updateMedia) {
        fetch(`http://localhost:8787/media?title=${encodeURIComponent(title)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateMedia)
        })
            .then(response => response.json())
            .then(() => {
                console.log('Media updated successfully');
                // עדכון המצב של הרשימה או פעולה אחרת
            })
            .catch(error => console.error('Error:', error));
    }


    getList = async () => {
        const files = await fetch(this.url + "/media");
        const data = await files.json();
        return data;
    }
}
export default new MediaStore();
class Bookmarks_API {
    static API_URL() { return "http://localhost:5000/api/bookmarks" };
    static async Head() {
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL(),
                type: "HEAD",
                contentType: "text/plain",
                complete: data => { resolve(data.getResponseHeader("Etag")); },
                error: (xhr) => { console.log(xhr); resolve(null); }
            });
        });
    }
    static async Get(id = null) {
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL() + (id != null ? "/" + id : ""),
                success: contacts => { resolve(contacts); },
                error: (xhr) => { console.log(xhr); resolve(null); }
            });
        });
    }
    static async Save(contact, create = true) {
        return new Promise(resolve => {
            $.ajax({
                url: create ? this.API_URL() : this.API_URL() + "/" + contact.Id,
                type: create ? "POST" : "PUT",
                contentType: 'application/json',
                data: JSON.stringify(contact),
                success: (/*data*/) => { resolve(true); },
                error: (/*xhr*/) => { resolve(false /*xhr.status*/); }
            });
        });
    }
    static async Delete(id) {
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL() + "/" + id,
                type: "DELETE",
                success: () => { resolve(true); },
                error: (/*xhr*/) => { resolve(false /*xhr.status*/); }
            });
        });
    }
}
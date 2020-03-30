function onSuccess (res, rej) {
    if (this.status === 200) {
        res(JSON.parse(this.responseText));
    } else {
        rej(JSON.parse(this.responseText));
    }  
}
function onFail (rej) {
    rej(JSON.parse(this.responseText));
}

//AJAX FETCH
export function fetchContent(method, url, token, contentType, formData, external) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.timeout = 3000; // time in milliseconds
        xhr.addEventListener('load', onSuccess.bind(xhr, res, rej));
        xhr.addEventListener('error', onFail.bind(xhr, rej));
        xhr.addEventListener('timeout', onFail.bind(xhr, rej));
        xhr.setRequestHeader('Content-type', contentType);
        if (method === "POST") {
            if (!token) { 
                xhr.send(formData) 
            } else {
                xhr.setRequestHeader('Authorization', `bearer ${token}`);
                xhr.send(formData);
            }
        } else {
            //xhr.setRequestHeader('X-Token', token);
            if (!external) {xhr.setRequestHeader('Authorization', `bearer ${token}`)};
            xhr.send();
        }



    })
}
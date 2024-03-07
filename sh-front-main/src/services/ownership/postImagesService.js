export function postImagesService({ formData }) {
    return fetch(`${process.env.REACT_APP_API_IMAGES}`, {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar la imagen');
        }
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('Error al enviar la imagen:', error);
        throw error; 
    });
}

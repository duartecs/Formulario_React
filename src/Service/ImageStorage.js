import { firebaseStorage } from "../Util/Firebase";

const ImageStorage = {
  upload: (image, setProgress) => {
    return new Promise((resolve, reject) => {
      const uploadTask = firebaseStorage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          firebaseStorage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              resolve(url);
            });
        }
      );
    });
  },
};

export default ImageStorage;

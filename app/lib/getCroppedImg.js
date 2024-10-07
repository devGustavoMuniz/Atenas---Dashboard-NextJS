export const createImage = (url, onLoad, onError) => {
  const image = new Image();
  image.crossOrigin = "anonymous"; // Necessário para evitar problemas de CORS
  image.src = url;

  image.addEventListener("load", () => onLoad(image));
  image.addEventListener("error", (error) => onError(error));
};

export default function getCroppedImg(imageSrc, croppedAreaPixels, callback) {
  createImage(
    imageSrc,
    (image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          callback(new Error("Canvas is empty"), null);
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        callback(null, fileUrl);
      }, "image/jpeg");
    },
    (error) => callback(error, null)
  );
}

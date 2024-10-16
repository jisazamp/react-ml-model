import { ChangeEvent, FormEvent, useState } from "react";

interface PostFileResponse {
  prediction: number;
}

const postFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/predict-image", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
};

export const App = () => {
  const [image, setImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState("");
  const [response, setResponse] = useState<PostFileResponse>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    if (!image) return;
    const data = (await postFile(image)) as PostFileResponse;
    setResponse(data);
    setIsLoading(false);
  };

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;
    if (!selectedFiles?.[0]) {
      setImage(undefined);
      setPreviewImage("");
      setResponse(undefined);
      return;
    }

    setImage(selectedFiles?.[0]);
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  };

  return (
    <div className="container col-md-6 offset-md-3 mt-3">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Imagen
          </label>
          <input
            accept="image/*"
            aria-describedby="emailHelp"
            className="form-control"
            id="exampleInputEmail1"
            onChange={onImageSelect}
            type="file"
          />
        </div>

        {previewImage && <img src={previewImage} alt="" />}
        {response && (
          <p className="mt-3 mb-3">
            {isLoading
              ? "Cargando..."
              : `Ese número parece ser: ${response.prediction}`}
          </p>
        )}

        <div className="d-grid mt-3">
          <button type="submit" className="btn btn-primary">
            Clasificar
          </button>
        </div>
      </form>
    </div>
  );
};

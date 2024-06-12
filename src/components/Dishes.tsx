import { useContext, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

function Dishes() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const fileRef = useRef<File | null | undefined>(null);

  const { firebase: app } = useContext(FirebaseContext) as FirebaseContextType;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      category: "",
      image: "",
      description: "",
      availability: true,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "El nombre del plato debe tener al menos 3 caracteres")
        .required("El nombre del plato es obligatorio"),
      price: Yup.number()
        .min(1, "El precio del plato debe ser mayor a 0")
        .required("El precio del plato es obligatorio"),
      category: Yup.string().required("La categoria del plato es obligatoria"),
      description: Yup.string()
        .min(10, "La descripción del plato debe tener al menos 10 caracteres")
        .required("La descripción del plato es obligatoria"),
    }),
    onSubmit: async (newDish) => {
      try {
        await addDoc(collection(db, "dishes"), {
          ...newDish,
          image: imageURL || "https://via.placeholder.com/300", // Placeholder image URL
          availability: true,
        });
        console.log("Plato agregado correctamente");
        navigate("/menu");
      } catch (error) {
        console.error("Error agregando plato", error);
      }
    },
  });

  const handleUploadStart = () => {
    setUploading(true);
    setProgress(0);
  };

  const handleUploadError = (error: unknown) => {
    setUploading(false);
    console.error("Error subiendo imagen", error);
  };

  const handleUploadSuccess = (url: string) => {
    setUploading(false);
    setProgress(100);
    setImageURL(url);
    formik.setFieldValue("image", url); // Update formik image value
    console.log("Imagen subida correctamente", url);
  };

  const handleProgress = (progress: number) => {
    setProgress(progress);
    console.log(`Progreso de subida: ${progress}%`);
  };

  const handleFileUpload = (file: File) => {
    handleUploadStart();

    const storage = getStorage(app);
    const storageRef = ref(storage, `dishes/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        handleProgress(progress);
      },
      (error) => {
        handleUploadError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          handleUploadSuccess(downloadURL);
        } catch (error) {
          handleUploadError(error);
        }
      }
    );
  };

  return (
    <section className="relative flex flex-col items-center px-5 mt-4 md:w-3/4 xl:w-4/5">
      <h1 className="self-start px-4 text-4xl font-bold dark:text-white">
        Platos
      </h1>

      <div className="w-full max-w-full lg:max-w-md xl:max-w-lg">
        <form className="p-4" onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese nombre del plato"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {formik.errors.name}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Precio
            </label>
            <input
              type="number"
              id="price"
              aria-describedby="helper-text-explanation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese precio del plato"
              min={0}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.price && formik.touched.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {formik.errors.price}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Categoría
            </label>
            <select
              id="category"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option disabled>-- Seleccione categoría --</option>
              <option value="breakfast">Desayuno</option>
              <option value="food">Comida</option>
              <option value="dinner">Cena</option>
              <option value="drink">Bebida</option>
              <option value="dessert">Postre</option>
              <option value="salad">Ensalada</option>
            </select>
            {formik.errors.category && formik.touched.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {formik.errors.category}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="image"
            >
              Imagen del plato
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  fileRef.current = file;
                  handleFileUpload(file);
                }
              }}
            />
            {uploading && (
              <div
                className="w-full bg-gray-200 rounded-full mt-3 h-2.5 dark:bg-gray-700"
                role="progressbar"
              >
                <div
                  className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Descripción
            </label>
            <textarea
              id="description"
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-none"
              placeholder="Ingrese descripción del plato"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            ></textarea>
            {formik.errors.description && formik.touched.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                {formik.errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Agregar plato
          </button>
        </form>
      </div>
    </section>
  );
}

export default Dishes;

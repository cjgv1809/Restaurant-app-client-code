import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";

function Dish({ product }: { product: Dish }) {
  const [localProduct, setLocalProduct] = useState(product);

  const handleAvailability = async () => {
    // Toggle availability
    const updatedAvailability = !localProduct.availability;

    // Update local state
    setLocalProduct((prevProduct) => ({
      ...prevProduct,
      availability: updatedAvailability,
    }));

    try {
      // Update product in the database
      await updateDoc(doc(db, "dishes", localProduct.id), {
        availability: updatedAvailability,
      });
    } catch (error) {
      console.error("Error updating availability", error);
    }
  };

  return (
    <div
      key={localProduct.id}
      className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 max-w-72"
    >
      <img
        className="object-contain w-full min-h-[235px] rounded-t-lg"
        src={localProduct.image}
        alt={localProduct.name}
        width={285}
        height={285}
      />
      <div className="flex flex-col px-5 pb-5 mt-4">
        <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {localProduct.name}
        </h3>

        <div className="flex items-center mt-2.5 mb-1 space-x-1 rtl:space-x-reverse">
          <p className="overflow-hidden text-lg font-light text-gray-400 dark:text-white whitespace-nowrap text-ellipsis">
            {localProduct.description}
          </p>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-sm text-gray-400 font-extralight">
              Categoria:
            </span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 capitalize">
              {localProduct.category}
            </span>
          </div>
          <div className="mt-3">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localProduct.availability}
                className="sr-only peer"
                onChange={handleAvailability}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="text-sm font-medium text-gray-900 ms-3 dark:text-gray-300">
                {localProduct.availability ? "Disponible" : "No disponible"}
              </span>
            </label>
          </div>
        </div>

        {/* {localProduct.availability ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 w-fit">
            Disponible
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 w-fit">
            No disponible
          </span>
        )} */}

        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ${localProduct.price.toFixed(2)}
          </span>
          {/* <a
                  href="#"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add to cart
                </a> */}
        </div>
      </div>
    </div>
  );
}

export default Dish;

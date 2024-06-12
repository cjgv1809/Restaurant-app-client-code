import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DishComponent from "../ui/Dish";
import Skeleton from "../ui/Skeleton";

function Menu() {
  const [products, setProducts] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      const dishesCollection = collection(db, "dishes");
      const dishesSnapshot = await getDocs(dishesCollection);
      const dishesList = dishesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setProducts(dishesList as Dish[]);
    };

    fetchDishes();
  }, [db]);

  return (
    <section className="relative px-3 mt-4 sm:px-5 md:w-3/4 xl:w-4/5">
      <div className="flex flex-wrap items-center justify-between px-4">
        <h1 className="text-4xl font-bold dark:text-white">Menu</h1>

        <Link
          to="/new-dish"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3 sm:mt-0"
        >
          <svg
            className="w-3.5 h-3.5 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 21"
          >
            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
          </svg>
          Agregar nuevo plato
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] sm:justify-items-center px-4 mt-10 gap-4 pb-40">
        {loading ? (
          <Skeleton />
        ) : (
          products.map((product) => (
            <DishComponent key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
}

export default Menu;

import { FirebaseApp } from "firebase/app";

declare global {
  interface FirebaseContextType {
    firebase: FirebaseApp;
  }

  interface Dish {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    availability: boolean;
  }
}
